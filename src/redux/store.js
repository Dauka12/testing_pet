// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import localStorageMiddleware from './localStorageMiddleware';
import musicReducer from './slices/musicSlice';
import newsReducer from './slices/newsSlice';

const preloadedState = {
    news: JSON.parse(localStorage.getItem('news') || '{}'),
    music: JSON.parse(localStorage.getItem('music') || '{"isPlaying": false}'), // Ensure that music is also preloaded
};

const store = configureStore({
    reducer: {
        news: newsReducer,
        music: musicReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
    preloadedState,
});

export default store;
