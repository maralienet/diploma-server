import React from "react";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import { draw, clear } from "../Store/drawRouteSlice";
import { clearDetails } from "../Store/routeDetailsSlice";

function ManageBtns() {
    const dispatch = useDispatch();
    const routeDetails = useSelector(state => state.routeDetails.routeDetails);
    const selectedCities = useSelector(state => state.selectedCities.selectedCities);

    function handleDraw() {
        if (routeDetails !== null && routeDetails.car && selectedCities.length>0)
            dispatch(draw());
        // else if(routeDetails !== null){

        // }
        else {
            console.log(';;;;')
        }
    }

    function handleClear() {
        dispatch(clearDetails());
        dispatch(clear());
    }

    return (
        <div className="manageBtns">
            <div>
                <button className="drawRoutes" type="button" onClick={() => handleDraw()}>
                    Построить маршрут
                </button>
            </div>
            <div>
                <button className="drawRoutes" type="button" onClick={() => handleClear()}>
                    Сбросить
                </button>
            </div>
        </div>
    );
}

export default ManageBtns;