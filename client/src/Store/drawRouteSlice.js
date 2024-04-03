import { createSlice } from '@reduxjs/toolkit';

const drawRouteSlice = createSlice({
    name: 'drawRoute',
    initialState: {
        drawRoute: false
    },
    reducers: {
        draw(state, action) {
            state.drawRoute = true;
            console.log(state.drawRoute)
        },

        clear(state,action){
            state.drawRoute = false;
            console.log(state.drawRoute)
        }
    }
})
export const { draw, clear } = drawRouteSlice.actions;

export default drawRouteSlice.reducer;