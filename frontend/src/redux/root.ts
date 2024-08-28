import { arkiverteDokumenterApi } from '@app/redux/api/journalposter';
import { kodeverkApi } from '@app/redux/api/kodeverk';
import { oppgaverApi } from '@app/redux/api/oppgaver';
import { partApi } from '@app/redux/api/part';
import { registreringApi } from '@app/redux/api/registreringer/registrering';
import { saksbehandlereApi } from '@app/redux/api/saksbehandlere';
import { statusApi } from '@app/redux/api/status';
import { svarbrevSettingsApi } from '@app/redux/api/svarbrev-settings';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
  [registreringApi.reducerPath]: registreringApi.reducer,
  [arkiverteDokumenterApi.reducerPath]: arkiverteDokumenterApi.reducer,
  [partApi.reducerPath]: partApi.reducer,
  [svarbrevSettingsApi.reducerPath]: svarbrevSettingsApi.reducer,
  [oppgaverApi.reducerPath]: oppgaverApi.reducer,
  [saksbehandlereApi.reducerPath]: saksbehandlereApi.reducer,
  [kodeverkApi.reducerPath]: kodeverkApi.reducer,
  [statusApi.reducerPath]: statusApi.reducer,
});

// eslint-disable-next-line import/no-unused-modules
export type RootState = ReturnType<typeof rootReducer>;