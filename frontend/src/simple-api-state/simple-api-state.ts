import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { loggedOutToast } from '@app/components/toast/toast-content/logged-out';
import { ENVIRONMENT } from '@app/environment';
import { generateTraceParent } from '@app/functions/generate-request-id';
import { HeaderKeys, tabId } from '@app/headers';
import { InternalOptions, Listener, Method, NoRetryError, Options, RequestBody, State, UpdateData } from './types';

export class SimpleApiState<T> {
  private data: T | undefined = undefined;
  private isLoading = false;
  private isUninitialized = true;
  private isError = false;
  private isSuccess = false;
  private error: Error | undefined = undefined;
  private listeners: Listener<T>[] = [];
  private options: InternalOptions = { prefetch: false, cacheTime: 60_000, method: Method.GET };
  private retryTimer: NodeJS.Timeout | undefined;
  private transformResponse: ((response: T) => T) | undefined;

  // Request data
  private headers: Record<string, string> = {
    [HeaderKeys.VERSION]: ENVIRONMENT.version,
    [HeaderKeys.TAB_ID]: tabId,
    Accept: 'application/json',
  };
  private body: string | null = null;
  private cache: RequestCache = 'default';

  constructor(
    private url: string,
    options?: Options,
    body: RequestBody = undefined,
    transformResponse?: (response: T) => T,
  ) {
    this.options = Object.assign(this.options, options);
    this.transformResponse = transformResponse;

    this.prepareStaticRequestData(this.options.method, body);

    if (this.options.prefetch) {
      this.fetchData();
    }
  }

  private prepareStaticRequestData = (method: Method, body: RequestBody): void => {
    if (method === Method.POST || method === Method.PUT) {
      this.headers['Content-Type'] = 'application/json';
      this.cache = 'no-cache';

      if (typeof body === 'string') {
        this.body = body;
      } else if (body !== null && body !== undefined) {
        this.body = JSON.stringify(body);
      }
    }
  };

  private fetchData = async (tryCount = 1): Promise<T | undefined> => {
    this.isUninitialized = false;
    this.isLoading = true;
    this.onChange();

    const { method } = this.options;

    try {
      this.headers[HeaderKeys.TRACEPARENT] = generateTraceParent();

      const response = await fetch(this.url, {
        method,
        body: this.body,
        cache: this.cache,
        headers: this.headers,
      });

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

      const data = (await response.json()) as T;

      if (this.transformResponse === undefined) {
        this.data = data;
      } else {
        this.data = this.transformResponse(data);
      }

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
        this.retryTimer = setTimeout(() => this.fetchData(tryCount + 1), tryCount * 3_000);
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
    clear: this.clear,
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

      if (this.options.cacheTime === -1) {
        return;
      }

      this.dataTimeout = setTimeout(this.clear, this.options.cacheTime);
    }
  };

  public updateData: UpdateData<T> = (updater): void => {
    this.data = updater(this.data);
    this.onChange();
  };

  private clear = (): void => {
    this.data = undefined;
    this.error = undefined;
    this.isError = false;
    this.onChange();
  };
}
