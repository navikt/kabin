import { ENVIRONMENT } from '@app/environment';

export const KABAL_URL = ENVIRONMENT.isProduction ? 'https://kabal.intern.nav.no' : 'https://kabal.intern.dev.nav.no';
