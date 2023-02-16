import { useEffect, useState } from 'react';
import { skipToken } from '../types/common';
import { apiErrorToast } from './../components/toast/toast-content/fetch-error-toast';

interface State<T> {
  data: T | undefined;
  isLoading: boolean;
  isUninitialized: boolean;
  isError: boolean;
  error: Error | undefined;
  isSuccess: boolean;
  updateData: UpdateData<T>;
}

interface InternalOptions {
  prefetch: boolean;
  cacheTime: number;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export type RequestBody = Record<string, unknown> | string | undefined;

export type Options = Partial<InternalOptions> | undefined;

type Listener<T> = (state: State<T>) => void;
type UpdateData<T> = (updater: (data: T | undefined) => T | undefined) => void;

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

  private fetchData = async () => {
    this.isUninitialized = false;
    this.isLoading = true;
    this.onChange();

    try {
      const response = await fetch(this.url, this.req);

      if (!response.ok) {
        apiErrorToast(response, this.url);
        const error = new Error(`${response.status} ${response.statusText}`);
        this.isError = true;
        this.error = error;
        throw error;
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

      // Retry after 1 minute.
      setTimeout(this.fetchData, 60000);
    }

    this.isLoading = false;
    this.onChange();
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
  });

  public listen = (listener: Listener<T>): void => {
    clearTimeout(this.dataTimeout);

    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
      listener(this.getState());
    }

    if (!this.isLoading && !this.isError && typeof this.data === 'undefined') {
      this.fetchData();
    }
  };

  private dataTimeout: NodeJS.Timeout | undefined;

  public unlisten = (listener: Listener<T>): void => {
    clearTimeout(this.dataTimeout);

    this.listeners = this.listeners.filter((l) => l !== listener);

    if (this.listeners.length === 0) {
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
};

const INITIAL_STATE = {
  data: undefined,
  isLoading: false,
  isUninitialized: true,
  isError: false,
  isSuccess: false,
  error: undefined,
  updateData: () => console.warn('Tried to update data on an uninitialized state'),
};

export const useSimpleApiState = <T>(store: SimpleApiState<T> | typeof skipToken): State<T> => {
  const [state, setState] = useState<State<T>>(INITIAL_STATE);

  useEffect(() => {
    if (store === skipToken) {
      return;
    }

    store.listen(setState);

    return () => store.unlisten(setState);
  }, [store]);

  return store === skipToken ? SKIP_STATE : state;
};
