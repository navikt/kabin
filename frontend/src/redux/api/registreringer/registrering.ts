import { createApi } from '@reduxjs/toolkit/query/react';
import { KABIN_API_BASE_QUERY } from '@app/redux/api/common';

export const registreringApi = createApi({
  reducerPath: 'registreringApi',
  baseQuery: KABIN_API_BASE_QUERY,
  endpoints: () => ({}),
});
