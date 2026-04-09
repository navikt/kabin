import { queryStringify } from '@app/functions/query-string';
import { setHeaders } from '@app/headers';
import { tracer } from '@app/tracing/tracer';
import { SpanStatusCode } from '@opentelemetry/api';
import { type FetchArgs, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

const classifyNetworkError = (error: unknown): string => {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'abort';
  }

  if (error instanceof TypeError) {
    const message = error.message.toLowerCase();

    if (message.includes('failed to fetch') || message.includes('network')) {
      return 'network';
    }

    if (message.includes('cors')) {
      return 'cors';
    }

    return 'type-error';
  }

  return 'unknown';
};

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

  const retryingFetch = retry(
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

  const instrumented: typeof retryingFetch = (args, api, extraOptions) =>
    tracer.startActiveSpan(`rtk_query.${api.endpoint}`, async (span) => {
      span.setAttribute('type', api.type);

      try {
        const result = await retryingFetch(args, api, extraOptions);

        if (result.error !== undefined) {
          const status = result.meta?.response?.status;
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: `RTK Query error: ${status?.toString(10) ?? 'unknown'}`,
          });
        }
        return result;
      } catch (error) {
        const category = classifyNetworkError(error);
        span.setAttribute('error.category', category);
        span.setStatus({ code: SpanStatusCode.ERROR, message: `RTK Query request failed: ${category}` });
        if (error instanceof Error) {
          span.recordException(error);
        }
        throw error;
      } finally {
        span.end();
      }
    });

  return instrumented;
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
