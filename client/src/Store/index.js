import { configureStore } from '@reduxjs/toolkit';

import citiesReducer from './citiesSlice'
import selectedCitiesReducer from './selectedCitiesSlice';

export default configureStore({
    reducer: {
        cities: citiesReducer,
        selectedCities: selectedCitiesReducer
    }
})