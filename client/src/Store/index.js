import { configureStore } from '@reduxjs/toolkit';

import citiesReducer from './citiesSlice'
import selectedCitiesReducer from './selectedCitiesSlice';
import drawRouteReducer from './drawRouteSlice';

export default configureStore({
    reducer: {
        cities: citiesReducer,
        selectedCities: selectedCitiesReducer,
        drawRoute: drawRouteReducer
    }
})