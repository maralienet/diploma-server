import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { addSelectedCity, removeSelectedCity, clearSelectedCities } from "../Store/selectedCitiesSlice";

function CitiesSelect() {
    const dispatch = useDispatch();
    const cities = useSelector(state => state.cities.cities);

    useEffect(() => {
        let checks = Array.from(document.getElementsByClassName('citySelect'));
        checks.forEach((item) => item.checked = false)
    });

    function handleChange(city) {
        if (document.getElementById(city.wikiDataId).checked) {
            dispatch(addSelectedCity(city));
        }
        else {
            dispatch(removeSelectedCity(city));
        }
    }

    return (
        <div className="citySlct deliManage">
            <fieldset>
                <div className="header">
                    Населённые пункты
                </div>
                <div className="cities">
                    {
                        cities.map((city) => (
                            <div key={city.id} className="inputChkbox">
                                <input type="checkbox" className="citySelect" name='city' id={city.wikiDataId} onChange={() => handleChange({
                                    id: city.id,
                                    name: city.name,
                                    longitude: city.longitude,
                                    latitude: city.latitude,
                                    wikiDataId: city.wikiDataId
                                })} />
                                <label for={city.wikiDataId}>{city.name}</label>
                            </div>
                        ))
                    }
                </div>
            </fieldset>
        </div>
    );
}

export default CitiesSelect;