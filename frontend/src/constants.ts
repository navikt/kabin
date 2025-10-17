import { ENVIRONMENT } from '@app/environment';

export const getKabalUrl = (): string => {
  const hostname = window.location.hostname;

  if (hostname.includes('.ansatt.nav.no')) {
    return 'https://kabal.ansatt.nav.no';
  }

  return ENVIRONMENT.isProduction ? 'https://kabal.intern.nav.no' : 'https://kabal.intern.dev.nav.no';
};

export const KABAL_URL = getKabalUrl();
