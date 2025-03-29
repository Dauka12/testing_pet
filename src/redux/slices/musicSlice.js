// store/musicSlice.js

import { createSlice } from '@reduxjs/toolkit';

const musicSlice = createSlice({
    name: 'music',
    initialState: { isPlaying: false },
    reducers: {
        playMusic: (state) => {
            state.isPlaying = true;
        },
        pauseMusic: (state) => {
            state.isPlaying = false;
        }
    }
});

export const { playMusic, pauseMusic } = musicSlice.actions;
export default musicSlice.reducer;
