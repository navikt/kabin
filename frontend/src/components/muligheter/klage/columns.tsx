import type { IKlagemulighet } from '@app/types/mulighet';

export const KLAGEMULIGHETER_COLUMNS: (keyof IKlagemulighet)[] = [
  'fagsakId',
  'temaId',
  'vedtakDate',
  'klageBehandlendeEnhet',
  'originalFagsystemId',
];
