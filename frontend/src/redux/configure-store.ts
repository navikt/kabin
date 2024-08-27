import { configureStore } from '@reduxjs/toolkit';
import { arkiverteDokumenterApi } from '@app/redux/api/journalposter';
import { kodeverkApi } from '@app/redux/api/kodeverk';
import { oppgaverApi } from '@app/redux/api/oppgaver';
import { partApi } from '@app/redux/api/part';
import { registreringApi } from '@app/redux/api/registreringer/registrering';
import { saksbehandlereApi } from '@app/redux/api/saksbehandlere';
import { statusApi } from '@app/redux/api/status';
import { svarbrevSettingsApi } from '@app/redux/api/svarbrev-settings';
import { errorToastMiddleware } from '@app/redux/error-toast-middleware';
import { rootReducer } from '@app/redux/root';

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
      svarbrevSettingsApi.middleware,
      oppgaverApi.middleware,
      saksbehandlereApi.middleware,
      kodeverkApi.middleware,
      statusApi.middleware,
      errorToastMiddleware,
    ]),
});
