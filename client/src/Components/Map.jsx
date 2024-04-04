import React, { useEffect, useRef, useState } from "react";
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import axios from 'axios';
import citiesRU from '../citiesRU.json';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import { addCity, clearCities } from "../Store/citiesSlice";
import { addSelectedCity, clearSelectedCities } from "../Store/selectedCitiesSlice";
import { clear } from "../Store/drawRouteSlice";
import { addDetail, removeDetail, clearDetails } from "../Store/routeDetailsSlice";

function MainMap() {
    return (
        <YMaps query={{ apikey: '' }}>
            <div><InnerMap /></div>
        </YMaps>
    );
}

export default MainMap;

function InnerMap() {
    const selectedCities = useSelector(state => state.selectedCities.selectedCities);
    const drawRoute = useSelector(state => state.drawRoute.drawRoute);
    const [cities, setCities] = useState(null);
    const [city, setCity] = useState(null);
    const [ymaps, setYMaps] = useState(null);
    const [ready, setReady] = useState(false);
    const mapRef = useRef(null);
    const [placemarkGeometry, setPlacemarkGeometry] = React.useState(null);
    const [placemarkProperties, setPlacemarkProperties] = React.useState({
        iconCaption: 'поиск...',
        balloonContent: ''
    });
    const dispatch = useDispatch();

    const loadYmaps = new Promise((resolve, reject) => {
        if (window.ymaps) {
            resolve();
        } else {
            const script = document.createElement('script');
            script.src = 'https://api-maps.yandex.ru/2.1/?apikey=6ee3a7c7-546e-44ad-8333-de26a7ea6e19&lang=ru_RU'; // URL скрипта Yandex Maps
            script.onload = resolve;
            script.onerror = reject;
            document.head.append(script);
        }
    });

    useEffect(() => {
        loadYmaps.then(() => {
            const ymaps = window.ymaps;
            setYMaps(window.ymaps)
            ymaps.ready(() => {
                setReady(true);
            });
        }).catch((error) => {
            console.error('Ошибка при загрузке Yandex Maps:', error);
        });
    }, []);

    useEffect(() => {
        if (ready) {
            if (drawRoute && selectedCities.length > 0 && mapRef.current) {
                let refs = selectedCities.map(city => [city.latitude, city.longitude]);
                refs.push([selectedCities[0].latitude, selectedCities[0].longitude]);

                let multiRoute = new ymaps.multiRouter.MultiRoute({
                    referencePoints: refs
                }, {
                    boundsAutoApply: true
                });

                mapRef.current.geoObjects.each(function (geoObject) {
                    if (geoObject instanceof ymaps.multiRouter.MultiRoute) {
                        mapRef.current.geoObjects.remove(geoObject);
                    }
                });
                mapRef.current.geoObjects.add(multiRoute);
                multiRoute.model.events.add('requestsuccess', function () {
                    let length = multiRoute.model.getRoutes()[0].properties.get('distance').text;
                    dispatch(addDetail({ key: 'length', value: length }))

                    let duration = multiRoute.model.getRoutes()[0].properties.get('duration').text;
                    dispatch(addDetail({ key: 'duration', value: duration }))
                });
            }
            if (!drawRoute && selectedCities.length > 0 && mapRef.current) {
                mapRef.current.geoObjects.each(function (geoObject) {
                    if (geoObject instanceof ymaps.multiRouter.MultiRoute) {
                        mapRef.current.geoObjects.remove(geoObject);
                    }
                    if (geoObject instanceof ymaps.Placemark) {
                        mapRef.current.geoObjects.remove(geoObject);
                        setPlacemarkGeometry(null);
                        setPlacemarkProperties({
                            iconCaption: 'поиск...',
                            balloonContent: ''
                        });
                    }
                });
                mapRef.current.setCenter([53.902284, 27.561831], 7);
            }
        }
    }, [ready, drawRoute, selectedCities]);

    useEffect(() => {
        if (cities) {
            dispatch(clearCities());
            cities.forEach(city => dispatch(addCity(city)));
        }
    }, [cities]);

    useEffect(() => {
        if (!drawRoute) {
            dispatch(clearSelectedCities());
            dispatch(clearCities());
        }
    }, [drawRoute]);

    useEffect(() => {
        if (city) {
            dispatch(clearSelectedCities());
            dispatch(addSelectedCity(city));
            dispatch(clear());
        }
    }, [city]);

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
        if (!ymaps) {
            return;
        }
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
                    getCityInfo(city).then(cityInfo => {
                        setCity(cityInfo);
                        console.log(cityInfo);
                    });
                    getCityCode(city).then((wikiDataId) => {
                        if (wikiDataId != -1) {
                            let cits;
                            getAllData(wikiDataId, 100).then((allData) => {
                                cits = allData.map((item) => ({
                                    id: item.id,
                                    name: item.name,
                                    longitude: item.longitude,
                                    latitude: item.latitude,
                                    wikiDataId: item.wikiDataId
                                }));
                                cits.sort(function (a, b) {
                                    if (a.name < b.name) {
                                        return -1;
                                    }
                                    if (a.name > b.name) {
                                        return 1;
                                    }
                                    return 0;
                                });
                                setCities(cits);
                            });
                        }
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

    async function getCityInfo(cityName) {
        const wikiDataId = await getCityCode(cityName);
        if (wikiDataId != -1) {
            try {
                const response = await axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${wikiDataId}`, {
                    params: { languageCode: 'ru' },
                    headers: {
                        'X-RapidAPI-Key': '544ab5c1d1msh21eb38ee3d08c9ap1c3972jsn80695f100c3d',
                        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
                    }
                });
                let res = {
                    id: response.data.data.id,
                    name: response.data.data.name,
                    longitude: response.data.data.longitude,
                    latitude: response.data.data.latitude,
                    wikiDataId: response.data.data.wikiDataId
                };
                return res;
            } catch (error) {
                console.error(error);
            }
        }
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
                        if (response) {
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
                        } else {
                            console.error('Response is undefined');
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