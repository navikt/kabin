import { createApi } from '@reduxjs/toolkit/query/react';
import { KABIN_API_BASE_QUERY } from '@app/redux/api/common';
import { IAnkemulighet, IKlagemulighet } from '@app/types/mulighet';

export const muligheterApi = createApi({
  reducerPath: 'muligheterApi',
  baseQuery: KABIN_API_BASE_QUERY,
  endpoints: (builder) => ({
    getAnkemuligheter: builder.query<IAnkemulighet[], string>({
      query: (idnummer) => ({
        url: `/ankemuligheter?antall=50000`,
        method: 'POST',
        body: { idnummer },
      }),
    }),
    getKlagemuligheter: builder.query<IKlagemulighet[], string>({
      query: (idnummer) => ({
        url: `/klagemuligheter?antall=50000`,
        method: 'POST',
        body: { idnummer },
      }),
    }),
  }),
});

export const {
  useGetAnkemuligheterQuery,
  useGetKlagemuligheterQuery,
  useLazyGetAnkemuligheterQuery,
  useLazyGetKlagemuligheterQuery,
} = muligheterApi;
