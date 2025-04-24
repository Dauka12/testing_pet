import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { olympiadStore } from '../store/index.ts'; // Make sure this path is correct

// Define types for dispatch and selector
export type AppDispatch = typeof olympiadStore.dispatch;

// Use these hooks throughout your app instead of plain useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
