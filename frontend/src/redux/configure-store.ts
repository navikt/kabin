import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { arkiverteDokumenterApi } from '@app/redux/api/journalposter';
import { muligheterApi } from '@app/redux/api/muligheter';
import { partApi } from '@app/redux/api/part';
import { registreringApi } from '@app/redux/api/registrering';
import { RootState, rootReducer } from './root';

export const reduxStore = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat([
      registreringApi.middleware,
      arkiverteDokumenterApi.middleware,
      partApi.middleware,
      muligheterApi.middleware,
    ]),
});

export type AppDispatch = typeof reduxStore.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
