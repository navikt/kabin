import qs from 'qs';
import { Options, RequestBody, SimpleApiState } from './simple-api-state';

interface PathParams<Q> {
  query?: Q;
  path?: string;
}

export const getStateFactory = <T, Q>(basePath: string, options?: Options) => {
  const STATES: Map<string, SimpleApiState<T>> = new Map();

  return ({ path = '', query }: PathParams<Q>, body: RequestBody = undefined) => {
    const q: string = qs.stringify(query, { arrayFormat: 'comma', skipNulls: true, addQueryPrefix: true });
    const b: string | undefined = serializeBody(body);
    const url = `${basePath}${path}${q}`;
    const stateKey = `${url}:${b ?? 'undefined'}`;
    const existing = STATES.get(stateKey);

    if (existing === undefined) {
      const state = new SimpleApiState<T>(url, options, b);
      STATES.set(stateKey, state);

      return state;
    }

    return existing;
  };
};

const serializeBody = (body: RequestBody): string | undefined => {
  if (body === undefined) {
    return undefined;
  }

  if (typeof body === 'string') {
    return body;
  }

  return JSON.stringify(body);
};
