import { createApi } from '@reduxjs/toolkit/query/react';
import { API_BASE_QUERY, KABAL_API_BASE_PATH } from '@app/redux/api/common';
import { IPart, ISimplePart } from '@app/types/common';

export const partApi = createApi({
  reducerPath: 'partApi',
  baseQuery: API_BASE_QUERY,
  endpoints: (builder) => ({
    getPart: builder.query<ISimplePart, string>({
      query: (identifikator) => ({
        url: `${KABAL_API_BASE_PATH}/searchpart`,
        method: 'POST',
        body: { identifikator },
      }),
    }),
    getPartWithUtsendingskanal: builder.query<IPart, string>({
      query: (identifikator) => ({
        url: `${KABAL_API_BASE_PATH}/searchpartwithutsendingskanal`,
        method: 'POST',
        body: { identifikator },
      }),
    }),
  }),
});

export const { useGetPartQuery, useGetPartWithUtsendingskanalQuery } = partApi;
