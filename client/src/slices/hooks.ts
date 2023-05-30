import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppThunkDispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector