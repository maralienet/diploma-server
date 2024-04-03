import React from "react";
import CarsSelect from './CarsSelect';
import CitiesSelect from './CitiesSelect';
import RouteCities from "./RouteCities";

function MainManage() {
    return (
        <div className="mainManage">
            <CarsSelect />
            <CitiesSelect/>
            <RouteCities/>
        </div>
    );
}

export default MainManage;