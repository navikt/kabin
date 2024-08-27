import { createApi } from '@reduxjs/toolkit/query/react';
import { KABIN_API_BASE_QUERY } from '@app/redux/api/common';
import { IOppgave } from '@app/types/oppgave';

export interface IGetOppgaverParams {
  identifikator: string;
  temaId?: string;
}

export const oppgaverApi = createApi({
  reducerPath: 'oppgaverApi',
  baseQuery: KABIN_API_BASE_QUERY,
  endpoints: (builder) => ({
    getOppgaver: builder.query<IOppgave[], IGetOppgaverParams>({
      query: (body) => ({
        url: '/searchoppgave',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetOppgaverQuery } = oppgaverApi;
