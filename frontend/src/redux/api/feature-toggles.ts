import { ROOT_BASE_QUERY } from '@app/redux/api/common';
import { createApi } from '@reduxjs/toolkit/query/react';

export const featureToggleApi = createApi({
  reducerPath: 'featureToggleApi',
  baseQuery: ROOT_BASE_QUERY,
  endpoints: (builder) => ({
    getFeatureToggle: builder.query<{ enabled: boolean }, string>({
      query: (feature) => `/feature-toggle/${feature}`,
    }),
  }),
});

export const { useGetFeatureToggleQuery } = featureToggleApi;
