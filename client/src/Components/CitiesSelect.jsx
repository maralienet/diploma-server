import React from "react";

function CitiesSelect() {
    return (
        <div className="carSlct deliManage">
            <fieldset>
                <div className="header">
                    Населённые пункты
                </div>
                <div className="inputChkbox">
                    <input type="checkbox" name='city' id='city1' />
                    <label for='city1'>1</label>
                </div>
                <div className="inputChkbox">
                    <input type="checkbox" name='city' id='city2' />
                    <label for='city2'>2</label>
                </div>
                <div className="inputChkbox">
                    <input type="checkbox" name='city' id='city3' />
                    <label for='city3'>3</label>
                </div>
            </fieldset>
        </div>
    );
}

export default CitiesSelect;