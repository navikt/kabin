import { ValidationFieldNames } from '@app/types/validation';

export const FIELD_NAMES: Record<ValidationFieldNames, string> = {
  [ValidationFieldNames.MOTTATT_KLAGEINSTANS]: 'Mottatt Klageinstans',
  [ValidationFieldNames.MOTTATT_VEDTAKSINSTANS]: 'Mottatt vedtaksinstans',
  [ValidationFieldNames.FRIST]: 'Frist',
  [ValidationFieldNames.AVSENDER]: 'Avsender',
  [ValidationFieldNames.KLAGER]: 'Klager',
  [ValidationFieldNames.HJEMMEL_ID_LIST]: 'Hjemler',
  [ValidationFieldNames.YTELSE_ID]: 'Ytelse',
  [ValidationFieldNames.BEHANDLING_ID]: 'Vedtak',
  [ValidationFieldNames.JOURNALPOST_ID]: 'Journalpost',
  [ValidationFieldNames.FULLMEKTIG]: 'Fullmektig',
  [ValidationFieldNames.SAKSBEHANDLER]: 'Saksbehandler',
  [ValidationFieldNames.MULIGHET]: 'Mulighet',
  [ValidationFieldNames.ENHET]: 'Enhet',
  [ValidationFieldNames.OPPGAVE]: 'Gosys-oppgave',
};

export const useFieldName = (field: ValidationFieldNames) => FIELD_NAMES[field] ?? field;
