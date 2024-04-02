import React from "react";

function CarsSelect() {
    return (
        <div className="carSlct">
            <fieldset>
                <label for='Volvo7456'>Volvo FH16 (AX 7456-7)</label>
                <input type="radio" name='car' id='Volvo7456'/>
                <label for='MBenz3021'>Mercedes-Benz Actros (MS 3021-7)</label>
                <input type="radio" name='car' id='MBenz3021'/>
                <label for='Scania8790'>Scania R-series (SP 8790-7)</label>
                <input type="radio" name='car' id='Scania8790'/>
            </fieldset>
        </div>
    );
}

export default CarsSelect;