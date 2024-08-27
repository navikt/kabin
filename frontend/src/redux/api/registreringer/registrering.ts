import { createApi } from '@reduxjs/toolkit/query/react';
import { KABIN_API_BASE_QUERY } from '@app/redux/api/common';

export enum RegistreringTagType {
  REGISTRERING = 'registrering',
}

export const registreringApi = createApi({
  reducerPath: 'registreringApi',
  baseQuery: KABIN_API_BASE_QUERY,
  tagTypes: [RegistreringTagType.REGISTRERING],
  endpoints: () => ({}),
  keepUnusedDataFor: 4 * 60 * 60 * 1000, // 4 hours
});
