import React from "react";
import CarsSelect from './CarsSelect';
import CitiesSelect from './CitiesSelect';
import RouteCities from "./RouteCities";

import { useDispatch } from 'react-redux';
import { draw, clear } from "../Store/drawRouteSlice";

function MainManage() {
    const dispatch = useDispatch();

    return (
        <div className="mainManage">
            <div>
                <button className="drawRoutes" type="button" onClick={() => dispatch(draw())}>
                    Построить маршрут
                </button>
                <button className="drawRoutes" type="button" onClick={() => dispatch(clear())}>
                    Сбросить
                </button>
            </div>
            <CarsSelect />
            <CitiesSelect />
            <RouteCities />
        </div>
    );
}

export default MainManage;