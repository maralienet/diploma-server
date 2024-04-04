import React from "react";
import { useSelector } from 'react-redux';

function Details() {
    const routeDetails = useSelector(state => state.routeDetails.routeDetails);
    return (
        <div className="details">
            <div className="header">
                Детали маршрута:
            </div>
            <div className="detList">
                <div className="detail">
                    <p>
                        Грузовик: {routeDetails.car && routeDetails.car}
                    </p>
                </div>
                <div className="detail">
                    <p>
                        Расстояние: {routeDetails.duration && routeDetails.duration}
                    </p>
                </div>
                <div className="detail">
                    <p>
                        Затрачиваемое время: {routeDetails.length && routeDetails.length}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Details;