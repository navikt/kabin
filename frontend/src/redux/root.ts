import { combineReducers } from 'redux';
import { arkiverteDokumenterApi } from '@app/redux/api/journalposter';
import { muligheterApi } from '@app/redux/api/muligheter';
import { partApi } from '@app/redux/api/part';
import { registreringApi } from '@app/redux/api/registreringer/registrering';
import { svarbrevSettingsApi } from '@app/redux/api/svarbrev-settings';

export const rootReducer = combineReducers({
  [registreringApi.reducerPath]: registreringApi.reducer,
  [arkiverteDokumenterApi.reducerPath]: arkiverteDokumenterApi.reducer,
  [partApi.reducerPath]: partApi.reducer,
  [muligheterApi.reducerPath]: muligheterApi.reducer,
  [svarbrevSettingsApi.reducerPath]: svarbrevSettingsApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
