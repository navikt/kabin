import { combineReducers } from 'redux';
import { arkiverteDokumenterApi } from '@app/redux/api/journalposter';
import { partApi } from '@app/redux/api/part';
import { registreringApi } from '@app/redux/api/registrering';

export const rootReducer = combineReducers({
  [registreringApi.reducerPath]: registreringApi.reducer,
  [arkiverteDokumenterApi.reducerPath]: arkiverteDokumenterApi.reducer,
  [partApi.reducerPath]: partApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
