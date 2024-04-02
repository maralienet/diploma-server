import React from "react";
import CarsSelect from './CarsSelect';
import CitiesSelect from './CitiesSelect';

function MainManage() {
    return (
        <div className="mainManage">
            <CarsSelect />
            <CitiesSelect />
        </div>
    );
}

export default MainManage;