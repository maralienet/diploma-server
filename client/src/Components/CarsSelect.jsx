import React, { useState } from "react";
import { useDispatch } from 'react-redux';

import { addDetail } from "../Store/routeDetailsSlice";

function CarsSelect() {
    const dispatch = useDispatch();

    function HandleChange(car) {
        dispatch(addDetail({ key: 'car', value: car }));
    }
    return (
        <div className="carSlct deliManage">
            <fieldset>
                <div className="header">
                    Выбор грузовика
                </div>
                <div className="inputRadio">
                    <input type="radio" name='car' id='Volvo7456' value='Volvo FH16 (AX 7456-7)' onClick={(e)=>HandleChange(e.target.value)} />
                    <label for='Volvo7456'>Volvo FH16 (AX 7456-7)</label>
                </div>
                <div className="inputRadio">
                    <input type="radio" name='car' id='MBenz3021' value='Mercedes-Benz Actros (MS 3021-7)' onClick={(e)=>HandleChange(e.target.value)} />
                    <label for='MBenz3021'>Mercedes-Benz Actros (MS 3021-7)</label>
                </div>
                <div className="inputRadio">
                    <input type="radio" name='car' id='Scania8790' value='Scania R-series (SP 8790-7)' onClick={(e)=>HandleChange(e.target.value)} />
                    <label for='Scania8790'>Scania R-series (SP 8790-7)</label>
                </div>
            </fieldset>
        </div>
    );
}

export default CarsSelect;