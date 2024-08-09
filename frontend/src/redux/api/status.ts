import { createApi } from '@reduxjs/toolkit/query/react';
import { KABIN_API_BASE_QUERY } from '@app/redux/api/common';
import { IAnkestatus, IKlagestatus } from '@app/types/status';

export const statusApi = createApi({
  reducerPath: 'statusApi',
  baseQuery: KABIN_API_BASE_QUERY,
  endpoints: (builder) => ({
    getKlageStatus: builder.query<IKlagestatus, string>({
      query: (id) => `/klager/${id}/status`,
    }),
    getAnkeStatus: builder.query<IAnkestatus, string>({
      query: (id) => `/anker/${id}/status`,
    }),
  }),
});

export const { useGetKlageStatusQuery, useGetAnkeStatusQuery, usePrefetch } = statusApi;
