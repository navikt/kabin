import { KABIN_API_BASE_QUERY } from '@app/redux/api/common';
import type { IAnkestatus, IKlagestatus, IOmgjøringskravstatus } from '@app/types/status';
import { createApi } from '@reduxjs/toolkit/query/react';

export const statusApi = createApi({
  reducerPath: 'statusApi',
  baseQuery: KABIN_API_BASE_QUERY,
  endpoints: (builder) => ({
    getKlageStatus: builder.query<IKlagestatus, string>({
      query: (id) => `/behandlinger/${id}/status`,
    }),
    getAnkeStatus: builder.query<IAnkestatus, string>({
      query: (id) => `/behandlinger/${id}/status`,
    }),
    getOmgjøringskravStatus: builder.query<IOmgjøringskravstatus, string>({
      query: (id) => `/behandlinger/${id}/status`,
    }),
  }),
});

export const { useGetKlageStatusQuery, useGetAnkeStatusQuery, useGetOmgjøringskravStatusQuery, usePrefetch } =
  statusApi;
