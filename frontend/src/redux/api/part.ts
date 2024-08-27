import { createApi } from '@reduxjs/toolkit/query/react';
import { KABAL_API_BASE_QUERY } from '@app/redux/api/common';
import { SearchPartWithUtsendingskanalParams } from '@app/redux/api/registreringer/param-types';
import { IPart, ISimplePart } from '@app/types/common';

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
