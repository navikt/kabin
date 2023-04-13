import { loggedOutToast } from '@app/components/toast/toast-content/logged-out';

export const request = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);

  if (response.status === 401) {
    loggedOutToast();
  }

  return response;
};
