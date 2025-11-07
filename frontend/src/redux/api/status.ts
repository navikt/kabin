import { KABIN_API_BASE_QUERY } from '@app/redux/api/common';
import type { IAnkestatus, IBegjæringOmGjenopptakStatus, IKlagestatus, IOmgjøringskravstatus } from '@app/types/status';
import { createApi } from '@reduxjs/toolkit/query/react';

export const statusApi = createApi({
  reducerPath: 'statusApi',
  baseQuery: KABIN_API_BASE_QUERY,
  endpoints: (builder) => ({
    getStatus: builder.query<IAnkestatus | IKlagestatus | IOmgjøringskravstatus | IBegjæringOmGjenopptakStatus, string>(
      {
        query: (id) => `/behandlinger/${id}/status`,
      },
    ),
  }),
});

export const { useGetStatusQuery, usePrefetch } = statusApi;
