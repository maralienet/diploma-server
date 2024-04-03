import React from "react";
import { useSelector } from 'react-redux';

function RouteCities() {
    const selectedCities = useSelector(state => state.selectedCities.selectedCities);
    return (
        <div className="routes deliManage">
            <fieldset>
                <div className="header">
                    Маршрут
                </div>
                <div className="cities">
                    <ol>
                        {
                            selectedCities.map((city) => (
                                <li key={city.id}>
                                    {city.name}
                                </li>
                            ))
                        }
                        {selectedCities[0] && <li>{selectedCities[0].name}</li>}
                    </ol>
                </div>
            </fieldset>
        </div>
    );
}

export default RouteCities;