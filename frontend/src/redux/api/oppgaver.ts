import { KABIN_API_BASE_QUERY } from '@app/redux/api/common';
import type { IGosysOppgave } from '@app/types/gosys-oppgave';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface IGetGosysOppgaverParams {
  identifikator: string;
  temaId?: string;
}

export const gosysOppgaverApi = createApi({
  reducerPath: 'gosysOppgaverApi',
  baseQuery: KABIN_API_BASE_QUERY,
  endpoints: (builder) => ({
    getGosysOppgaver: builder.query<IGosysOppgave[], IGetGosysOppgaverParams>({
      query: (body) => ({
        url: '/searchgosysoppgave',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetGosysOppgaverQuery } = gosysOppgaverApi;
