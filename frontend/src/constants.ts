import { ENVIRONMENT } from '@app/environment';

const getKabalUrl = (): string => {
  const hostname = window.location.hostname;

  if (hostname.includes('.ansatt.nav.no')) {
    return ENVIRONMENT.isProduction ? 'https://kabal.ansatt.nav.no' : 'https://kabal.ansatt.dev.nav.no';
  }

  return ENVIRONMENT.isProduction ? 'https://kabal.intern.nav.no' : 'https://kabal.intern.dev.nav.no';
};

export const KABAL_URL = getKabalUrl();
