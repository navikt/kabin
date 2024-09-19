import { type IError, isIError } from '@app/components/footer/error-type-guard';
import { KABAL_API_BASE_QUERY } from '@app/redux/api/common';
import type { SearchPartWithUtsendingskanalParams } from '@app/redux/api/registreringer/param-types';
import type { IPart, ISimplePart } from '@app/types/common';
import { createApi } from '@reduxjs/toolkit/query/react';

export const partApi = createApi({
  reducerPath: 'partApi',
  baseQuery: KABAL_API_BASE_QUERY,
  endpoints: (builder) => ({
    getPart: builder.query<ISimplePart | null, string>({
      query: (identifikator) => ({
        url: '/searchpart',
        method: 'POST',
        body: { identifikator },
        validateStatus: ({ status }) => status === 200 || status === 404,
      }),
      transformResponse: (response: IError | ISimplePart) => {
        if (isIError(response)) {
          return null;
        }

        return response;
      },
    }),
    getPartWithUtsendingskanal: builder.query<IPart | null, SearchPartWithUtsendingskanalParams>({
      query: (body) => ({
        url: '/searchpartwithutsendingskanal',
        method: 'POST',
        body,
        validateStatus: ({ status }) => status === 200 || status === 404,
      }),
      transformResponse: (response: IError | IPart) => {
        if (isIError(response)) {
          return null;
        }

        return response;
      },
    }),
  }),
});

export const {
  useGetPartQuery,
  useLazyGetPartQuery,
  useGetPartWithUtsendingskanalQuery,
  useLazyGetPartWithUtsendingskanalQuery,
} = partApi;
