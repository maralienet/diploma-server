import { createSlice } from '@reduxjs/toolkit';

const drawRouteSlice = createSlice({
    name: 'drawRoute',
    initialState: {
        drawRoute: false
    },
    reducers: {
        draw(state, action) {
            state.drawRoute = true;
        },

        clear(state,action){
            state.drawRoute = false;
        }
    }
})
export const { draw, clear } = drawRouteSlice.actions;

export default drawRouteSlice.reducer;