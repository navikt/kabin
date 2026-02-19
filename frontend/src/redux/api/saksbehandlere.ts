import { INNSTILLINGER_BASE_QUERY } from '@app/redux/api/common';
import type { ISaksbehandler } from '@app/types/common';
import { createApi } from '@reduxjs/toolkit/query/react';

interface ISaksbehandlereResponse {
  saksbehandlere: ISaksbehandler[];
}

export interface ISaksbehandlereParams {
  ytelseId: string;
  fnr: string;
}

export const saksbehandlereApi = createApi({
  reducerPath: 'saksbehandlereApi',
  baseQuery: INNSTILLINGER_BASE_QUERY,
  endpoints: (builder) => ({
    getSaksbehandlere: builder.query<ISaksbehandlereResponse, ISaksbehandlereParams>({
      query: (body) => ({
        url: '/search/saksbehandlere-for-bruker',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetSaksbehandlereQuery } = saksbehandlereApi;
