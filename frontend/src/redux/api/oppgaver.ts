import { createApi } from '@reduxjs/toolkit/query/react';
import { API_BASE_QUERY } from '@app/redux/api/common';
import { IOppgave } from '@app/types/oppgave';

export interface IGetOppgaverParams {
  identifikator: string;
  temaId?: string;
}

export const oppgaverApi = createApi({
  reducerPath: 'oppgaverApi',
  baseQuery: API_BASE_QUERY,
  endpoints: (builder) => ({
    getOppgaver: builder.query<IOppgave[], IGetOppgaverParams>({
      query: (body) => ({
        url: '/kabin-api/searchoppgave',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetOppgaverQuery } = oppgaverApi;
