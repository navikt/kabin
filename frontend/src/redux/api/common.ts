import { FetchArgs, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { queryStringify } from '@app/functions/query-string';
import { setHeaders } from '@app/headers';

export const IS_LOCALHOST = window.location.hostname === 'localhost';

const mode: RequestMode | undefined = IS_LOCALHOST ? 'cors' : undefined;

const staggeredBaseQuery = (baseUrl: string) => {
  const fetch = fetchBaseQuery({
    baseUrl,
    mode,
    credentials: 'include',
    paramsSerializer: queryStringify,
    prepareHeaders: setHeaders,
  });

  return retry(
    async (args: string | FetchArgs, api, extraOptions) => {
      const result = await fetch(args, api, extraOptions);

      if (typeof result.error === 'undefined') {
        return result;
      }

      const status = result.meta?.response?.status;

      if (status === undefined) {
        retry.fail(result.error);
      }

      if (status === 401) {
        if (!IS_LOCALHOST) {
          window.location.assign('/oauth2/login');
        }

        retry.fail(result.error);
      }

      if (status >= 400 && status < 500) {
        retry.fail(result.error);
      }

      return result;
    },
    {
      maxRetries: 3,
      backoff: (attempt) => new Promise((resolve) => setTimeout(resolve, 1000 * attempt)),
    },
  );
};

const API_PATH = '/api';

export const KABIN_API_BASE_PATH = `${API_PATH}/kabin-api`;
export const KABIN_API_BASE_QUERY = staggeredBaseQuery(KABIN_API_BASE_PATH);

export const KABAL_API_BASE_PATH = `${API_PATH}/kabal-api`;
export const KABAL_API_BASE_QUERY = staggeredBaseQuery(KABAL_API_BASE_PATH);

export const INNSTILLINGER_BASE_PATH = `${API_PATH}/kabal-innstillinger`;
export const INNSTILLINGER_BASE_QUERY = staggeredBaseQuery(INNSTILLINGER_BASE_PATH);

const KODEVERK_BASE_PATH = `${API_PATH}/klage-kodeverk-api/kodeverk`;
export const KODEVERK_BASE_QUERY = staggeredBaseQuery(KODEVERK_BASE_PATH);
