import React from "react";
import { useSelector } from 'react-redux';

function Details() {
    const routeDetails = useSelector(state => state.routeDetails.routeDetails);
    return (
        <div className="details">
            <div className="detail">
                <p>{routeDetails.length && routeDetails.length}</p>
            </div>
            <div className="detail">
                <p>{routeDetails.duration && routeDetails.duration}</p>
            </div>
        </div>
    );
}

export default Details;