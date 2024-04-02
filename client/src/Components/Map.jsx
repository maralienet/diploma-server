import React, { useEffect, useRef, useState } from "react";
import { YMaps, Map, Placemark, useYMaps, useLoad } from '@pbe/react-yandex-maps';
import axios from 'axios';
import citiesRU from '../citiesRU.json';


function MainMap() {
    return (
        <YMaps query={{ apikey: '6ee3a7c7-546e-44ad-8333-de26a7ea6e19' }}>
            <div>
                <InnerMap />
            </div>
        </YMaps>
    );
}

export default MainMap;

function InnerMap() {
    const ymaps = useYMaps();
    const mapRef = useRef(null);
    const [isYmapsLoaded, setIsYmapsLoaded] = useState(false);
    const [placemarkGeometry, setPlacemarkGeometry] = React.useState(null);
    const [placemarkProperties, setPlacemarkProperties] = React.useState({
        iconCaption: 'поиск...',
        balloonContent: ''
    });

    useEffect(() => {
        if (ymaps && ymaps.geocode) {
            setIsYmapsLoaded(true);
        }
    }, [ymaps]);

    useEffect(() => {
        if (ymaps.geocode) {
            getAddress(placemarkGeometry);
        }
    }, [ymaps, placemarkGeometry]);

    const handleMapClick = (e) => {
        const coords = e.get('coords');
        setPlacemarkGeometry(coords);
        getAddress(coords);
    };

    const handleDragEnd = (e) => {
        const coords = e.originalEvent.target.geometry.getCoordinates();
        getAddress(coords);
    };


    const getAddress = (coords) => {
        if (!isYmapsLoaded) return;
        setPlacemarkProperties(prev => ({ ...prev, iconCaption: 'поиск...' }));
        ymaps.geocode(coords).then(function (res) {
            let firstGeoObject = res.geoObjects.get(0);
            const locality = firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas();
            setPlacemarkProperties({
                iconCaption: locality,
                balloonContent: locality
            });
            if (locality[0]) {
                let city = locality[0];
                if (city) {
                    let radius = document.getElementById('radius').value;
                    getCityCode(city).then((wikiDataId) => {
                        if (wikiDataId != -1)
                            getAllData(wikiDataId, radius).then((allData) => {
                                console.log(allData);
                            });
                    });
                }
            }
        });
    };

    function getCityCode(city) {
        return axios.get('https://www.wikidata.org/w/api.php', {
            params: {
                action: 'wbgetentities',
                sites: 'ruwiki',
                titles: city,
                format: 'json',
                origin: '*'
            }
        })
            .then(response => {
                let wikiDataId = Object.keys(response.data.entities)[0];
                return wikiDataId;
            })
            .catch(error => {
                console.error(error);
            });
    }

    function findNearCities(url) {
        return axios.get(url, {
            headers: {
                'X-RapidAPI-Key': '544ab5c1d1msh21eb38ee3d08c9ap1c3972jsn80695f100c3d',
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error(error);
            });
    }

    function getAllData(cityCode, radius) {
        let allData = [];
        let i = 1;
        function getNextPage(url) {
            return new Promise(resolve => {
                setTimeout(() => {
                    findNearCities(url).then((response) => {
                        const filteredData = response.data.filter(city => citiesRU.some(cityRU => cityRU.wikiDataId === city.wikiDataId && cityRU.id === city.id));
                        allData = allData.concat(filteredData);
                        let nextLink;
                        if (response.links)
                            nextLink = response.links.find(link => link.rel === 'next');
                        if (nextLink) {
                            resolve(getNextPage(`https://wft-geo-db.p.rapidapi.com${nextLink.href}`));
                            console.log(i++)
                        } else {
                            resolve(allData);
                        }
                    });
                }, 1500);
            });
        }
        return getNextPage(`https://wft-geo-db.p.rapidapi.com/v1/geo/places/${cityCode}/nearbyPlaces?radius=${radius}&types=CITY&distanceUnit=KM&countryIds=Q184&minPopulation=5000&languageCode=ru`);
    }

    return (
        <Map width={'100%'} height={'700px'} defaultState={{ center: [53.902284, 27.561831], zoom: 7 }} instanceRef={mapRef} onClick={handleMapClick}>
            {placemarkGeometry && (
                <Placemark
                    geometry={placemarkGeometry}
                    properties={placemarkProperties}
                    options={{ preset: 'islands#violetDotIconWithCaption', draggable: true }}
                    onDragEnd={handleDragEnd}
                />
            )}
        </Map>
    );
}