import { createSlice } from '@reduxjs/toolkit';

const citiesSlice = createSlice({
    name: 'cities',
    initialState: {
        cities: []
    },
    reducers: {
        addCity(state, action) {
            state.cities = [...state.cities, {
                id: action.payload.id,
                name: action.payload.name,
                longitude: action.payload.longitude,
                latitude: action.payload.latitude,
                wikiDataId: action.payload.wikiDataId
            }]
        },

        clearCities(state,action){
            state.cities = [];
        }
    }
})
export const { addCity, clearCities } = citiesSlice.actions;

export default citiesSlice.reducer;