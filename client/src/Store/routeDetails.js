import { createSlice } from '@reduxjs/toolkit';

const routeDetailsSlice = createSlice({
    name: 'routeDetails',
    initialState: {
        routeDetails: false
    },
    reducers: {
        draw(state, action) {
            state.routeDetails = true;
            console.log(state.routeDetails)
        },

        clear(state,action){
            state.routeDetails = false;
            console.log(state.routeDetails)
        }
    }
})
export const { draw, clear } = routeDetailsSlice.actions;

export default routeDetailsSlice.reducer;