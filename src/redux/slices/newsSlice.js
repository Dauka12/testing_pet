// src/redux/newsSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedNews: null,
};

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        selectNews(state, action) {
            state.selectedNews = action.payload;
        },
    },
});

export const { selectNews } = newsSlice.actions;
export default newsSlice.reducer;
