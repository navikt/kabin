import { KODEVERK_BASE_QUERY } from '@app/redux/api/common';
import type { IKodeverkSimpleValue, IKodeverkValue, IYtelserLatest } from '@app/types/kodeverk';
import { createApi } from '@reduxjs/toolkit/query/react';

export const kodeverkApi = createApi({
  reducerPath: 'kodeverkApi',
  baseQuery: KODEVERK_BASE_QUERY,
  endpoints: (builder) => ({
    getSimpleYtelser: builder.query<IKodeverkSimpleValue[], void>({
      query: () => '/ytelser/simple',
    }),
    getLatestYtelser: builder.query<IYtelserLatest[], void>({
      query: () => '/ytelser/latest',
    }),
    getTema: builder.query<IKodeverkValue[], void>({
      query: () => '/tema',
    }),
    getVedtaksenheter: builder.query<IKodeverkSimpleValue[], void>({
      query: () => '/vedtaksenheter',
    }),
    getKlageenheter: builder.query<IKodeverkSimpleValue[], void>({
      query: () => '/klageenheter',
    }),
    getFagsystemer: builder.query<IKodeverkValue[], void>({
      query: () => '/fagsystemer',
    }),
    getHjemlerMap: builder.query<Record<string, string>, void>({
      query: () => '/hjemlermap',
    }),
    getTemaYtelser: builder.query<IKodeverkSimpleValue[], string>({
      query: (tema) => `/tema/${tema}/ytelser/latest`,
    }),
  }),
});

export const {
  useGetSimpleYtelserQuery,
  useGetLatestYtelserQuery,
  useGetTemaQuery,
  useGetVedtaksenheterQuery,
  useGetKlageenheterQuery,
  useGetFagsystemerQuery,
  useGetHjemlerMapQuery,
  useGetTemaYtelserQuery,
} = kodeverkApi;
