import { useEffect, useState } from 'react';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { loggedOutToast } from '@app/components/toast/toast-content/logged-out';
import { skipToken } from '@app/types/common';
import { InternalOptions, Listener, NoRetryError, Options, RequestBody, State, UpdateData } from './types';

export class SimpleApiState<T> {
  private data: T | undefined = undefined;
  private isLoading = false;
  private isUninitialized = true;
  private isError = false;
  private isSuccess = false;
  private error: Error | undefined = undefined;
  private listeners: Listener<T>[] = [];
  private options: InternalOptions = { prefetch: false, cacheTime: 60000, method: 'GET' };
  private req: RequestInit;
  private retryTimer: NodeJS.Timeout | undefined;

  constructor(private url: string, options?: Options, body: RequestBody = undefined) {
    this.options = Object.assign(this.options, options);
    this.req = this.getRequest(this.options, body);

    if (this.options.prefetch) {
      this.fetchData();
    }
  }

  private getRequest = ({ method }: InternalOptions, body: RequestBody): RequestInit => {
    const req: RequestInit = { method, headers: { Accept: 'application/json' } };

    if (method === 'POST' || method === 'PUT') {
      req.cache = 'no-cache';
      req.headers = { ...req.headers, 'Content-Type': 'application/json' };
      req.body = body === undefined || typeof body === 'string' ? body : JSON.stringify(body);
    }

    return req;
  };

  private fetchData = async (tryCount = 1): Promise<T | undefined> => {
    this.isUninitialized = false;
    this.isLoading = true;
    this.onChange();

    try {
      const response = await fetch(this.url, this.req);

      if (!response.ok) {
        if (response.status === 401) {
          loggedOutToast();
        } else if (response.status === 404) {
          this.isError = true;
          this.error = new NoRetryError(`${response.status} ${response.statusText}`);
        } else {
          apiErrorToast(response, this.url);
          this.isError = true;
          this.error = new Error(`${response.status} ${response.statusText}`);
        }

        throw this.error;
      }

      this.data = (await response.json()) as T;
      this.isSuccess = true;
    } catch (e) {
      this.data = undefined;
      this.isError = true;

      if (e instanceof Error) {
        this.error = e;
      } else {
        this.error = new Error('Unknown error');
      }

      // Retry
      if (this.listeners.length !== 0 && !(e instanceof NoRetryError)) {
        this.retryTimer = setTimeout(() => this.fetchData(tryCount + 1), tryCount * 3000);
      }
    }

    this.isLoading = false;
    this.onChange();

    return this.data;
  };

  private onChange = (): void => {
    const state = this.getState();

    this.listeners.forEach((listener) => listener(state));
  };

  public getState = (): State<T> => ({
    data: this.data,
    isLoading: this.isLoading,
    isUninitialized: this.isUninitialized,
    isError: this.isError,
    isSuccess: this.isSuccess,
    error: this.error,
    updateData: this.updateData,
    refetch: this.fetchData,
  });

  public listen = (listener: Listener<T>): void => {
    clearTimeout(this.dataTimeout);

    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
      listener(this.getState());
    }

    if (!this.isLoading && typeof this.data === 'undefined') {
      this.fetchData();
    }
  };

  private dataTimeout: NodeJS.Timeout | undefined;

  public unlisten = (listener: Listener<T>): void => {
    clearTimeout(this.dataTimeout);

    this.listeners = this.listeners.filter((l) => l !== listener);

    if (this.listeners.length === 0) {
      clearTimeout(this.retryTimer);

      if (this.options.cacheTime > 0) {
        this.dataTimeout = setTimeout(this.clear, this.options.cacheTime);
      }
    }
  };

  public updateData: UpdateData<T> = (updater): void => {
    this.data = updater(this.data);
    this.onChange();
  };

  private clear = (): void => {
    console.info('Clearing cached data for', this.url);
    this.data = undefined;
    this.error = undefined;
    this.isError = false;
    this.onChange();
  };
}

const SKIP_STATE = {
  data: undefined,
  isLoading: false,
  isUninitialized: false,
  isError: false,
  isSuccess: false,
  error: undefined,
  updateData: () => console.warn('Tried to update data on a skipped state'),
  refetch: async () => {
    console.warn('Tried to refetch data on a skipped state');

    return undefined;
  },
};

const INITIAL_STATE = {
  data: undefined,
  isLoading: false,
  isUninitialized: true,
  isError: false,
  isSuccess: false,
  error: undefined,
  updateData: () => console.warn('Tried to update data on an uninitialized state'),
  refetch: async () => {
    console.warn('Tried to refetch data on an uninitialized state');

    return undefined;
  },
};

export const useSimpleApiState = <T>(store: SimpleApiState<T> | typeof skipToken): State<T> => {
  const [state, setState] = useState<State<T>>(store === skipToken ? INITIAL_STATE : store.getState());

  useEffect(() => {
    if (store === skipToken) {
      return;
    }

    store.listen(setState);

    return () => store.unlisten(setState);
  }, [store]);

  return store === skipToken ? SKIP_STATE : state;
};
