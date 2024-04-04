import React from "react";
import CarsSelect from './CarsSelect';
import CitiesSelect from './CitiesSelect';
import RouteCities from "./RouteCities";

import ManageBtns from "./ManageBtns";

function MainManage() {
    return (
        <div className="mainManage">
            <ManageBtns/>
            <CarsSelect />
            <CitiesSelect />
            <RouteCities />
        </div>
    );
}

export default MainManage;