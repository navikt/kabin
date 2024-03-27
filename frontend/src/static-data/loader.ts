import { getHeaders } from '@app/headers';

export const loadStaticData = async <T>(url: string, label: string, attempt: number = 0): Promise<T> => {
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (res.status === 401) {
    window.location.assign('/oauth2/login');
    throw new Error('Ikke innlogget');
  }

  if (res.status >= 500) {
    console.error(`Kunne ikke hente ${label}`, res.status, res.statusText);

    if (attempt >= 3) {
      throw new Error(`Kunne ikke hente ${label}`);
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        loadStaticData<T>(url, label, attempt + 1)
          .then(resolve)
          .catch(reject);
      }, 1000);
    });
  }

  if (!res.ok) {
    throw new Error(`Kunne ikke hente ${label}`);
  }

  return await res.json();
};
