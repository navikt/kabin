import { createApi } from '@reduxjs/toolkit/query/react';
import { KABIN_API_BASE_QUERY } from '@app/redux/api/common';

export const registreringApi = createApi({
  reducerPath: 'registreringApi',
  baseQuery: KABIN_API_BASE_QUERY,
  endpoints: () => ({}),
  keepUnusedDataFor: 4 * 60 * 60 * 1000, // 4 hour
});
