import { createSlice } from '@reduxjs/toolkit';

const selectedCitiesSlice = createSlice({
    name: 'selectedCities',
    initialState: {
        selectedCities: []
    },
    reducers: {
        addSelectedCity(state, action) {
            state.selectedCities = [...state.selectedCities, {
                id: action.payload.id,
                name: action.payload.name,
                longitude: action.payload.longitude,
                latitude: action.payload.latitude,
                wikiDataId: action.payload.wikiDataId
            }]
        },

        removeSelectedCity(state, action) {
            state.selectedCities = state.selectedCities.filter(city =>
                city.id !== action.payload.id
            )
        },

        clearSelectedCities(state, action) {
            state.selectedCities = [];
        }
    }
})
export const { addSelectedCity, removeSelectedCity, clearSelectedCities } = selectedCitiesSlice.actions;

export default selectedCitiesSlice.reducer;