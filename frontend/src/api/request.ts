import { loggedOutToast } from '@app/components/toast/toast-content/logged-out';
import { getHeaders } from '@app/headers';

export const request = async (url: string, options: RequestInit, signal?: AbortSignal) => {
  const response = await fetch(url, {
    ...options,
    headers: { ...getHeaders(), ...options.headers },
    signal,
  });

  if (response.status === 401) {
    loggedOutToast();
  }

  return response;
};
