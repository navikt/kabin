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
  prefetch: boolean;
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
