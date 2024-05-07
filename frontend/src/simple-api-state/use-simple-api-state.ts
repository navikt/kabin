import { useEffect, useState } from 'react';
import { SimpleApiState } from '@app/simple-api-state/simple-api-state';
import { skipToken } from '@app/types/common';
import { State } from './types';

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
  clear: () => console.warn('Tried to clear data on a skipped state'),
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
  clear: () => console.warn('Tried to clear data on an uninitialized state'),
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
