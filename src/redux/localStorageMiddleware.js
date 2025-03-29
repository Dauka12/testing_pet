// src/redux/localStorageMiddleware.ts

const localStorageMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();
    localStorage.setItem('news', JSON.stringify(state.news));
    localStorage.setItem('music', JSON.stringify(state.music)); // Save music slice to localStorage
    return result;
};

export default localStorageMiddleware;
