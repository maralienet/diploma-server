import { createSlice } from '@reduxjs/toolkit';

const routeDetailsSlice = createSlice({
    name: 'routeDetails',
    initialState: {
        routeDetails: {}
    },
    reducers: {
        addDetail(state, action) {
            state.routeDetails[action.payload.key] = action.payload.value;
        },

        removeDetail(state, action) {
            delete state.routeDetails[action.payload.key];
        },

        clearDetails(state) {
            state.routeDetails = {};
        }
    }
})

export const { addDetail, removeDetail, clearDetails } = routeDetailsSlice.actions;

export default routeDetailsSlice.reducer;
