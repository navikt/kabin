export interface State<T> {
  data: T | undefined;
  isLoading: boolean;
  isUninitialized: boolean;
  isError: boolean;
  error: Error | undefined;
  isSuccess: boolean;
  updateData: UpdateData<T>;
  refetch: () => Promise<T | undefined>;
  clear: () => void;
}

export interface InternalOptions {
  /**
   * If set to `true`, data will be fetched immediately.
   * If set to `false`, data will be fetched when the first listener is added.
   * @defaultValue `false`
   */
  prefetch: boolean;
  /**
   * Time in milliseconds to cache data.
   * If set to `0`, data will not be cached.
   * If set to `-1`, data will be cached forever.
   * @defaultValue `60_000` (1 minutes)
   */
  cacheTime: number;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export type RequestBody = Record<string, unknown> | string | undefined;

export type Options = Partial<InternalOptions> | undefined;

export type Listener<T> = (state: State<T>) => void;
export type UpdateData<T> = (updater: (data: T | undefined) => T | undefined) => void;

export class NoRetryError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export interface WillCreateNewJournalpostInput {
  journalpostId: string;
  fagsakId: string;
  fagsystemId: string;
}
