import { KABAL_API_BASE_QUERY } from '@app/redux/api/common';
import type { SearchPartWithUtsendingskanalParams } from '@app/redux/api/registreringer/param-types';
import type { IPart, ISimplePart } from '@app/types/common';
import { createApi } from '@reduxjs/toolkit/query/react';

export const partApi = createApi({
  reducerPath: 'partApi',
  baseQuery: KABAL_API_BASE_QUERY,
  endpoints: (builder) => ({
    getPart: builder.query<ISimplePart, string>({
      query: (identifikator) => ({
        url: '/searchpart',
        method: 'POST',
        body: { identifikator },
      }),
    }),
    getPartWithUtsendingskanal: builder.query<IPart, SearchPartWithUtsendingskanalParams>({
      query: (body) => ({
        url: '/searchpartwithutsendingskanal',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetPartQuery, useGetPartWithUtsendingskanalQuery } = partApi;
