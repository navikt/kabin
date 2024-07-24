import { useContext } from 'react';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';
import { ValidationFieldNames } from '@app/types/validation';

export const FIELD_NAMES: Record<Exclude<ValidationFieldNames, ValidationFieldNames.KLAGER>, string> = {
  [ValidationFieldNames.MOTTATT_KLAGEINSTANS]: 'Mottatt Klageinstans',
  [ValidationFieldNames.MOTTATT_VEDTAKSINSTANS]: 'Mottatt vedtaksinstans',
  [ValidationFieldNames.FRIST]: 'Frist',
  [ValidationFieldNames.AVSENDER]: 'Avsender',
  [ValidationFieldNames.HJEMMEL_ID_LIST]: 'Hjemler',
  [ValidationFieldNames.YTELSE_ID]: 'Ytelse',
  [ValidationFieldNames.BEHANDLING_ID]: 'Vedtak',
  [ValidationFieldNames.JOURNALPOST_ID]: 'Journalpost',
  [ValidationFieldNames.FULLMEKTIG]: 'Fullmektig',
  [ValidationFieldNames.SAKSBEHANDLER]: 'Saksbehandler',
  [ValidationFieldNames.MULIGHET]: 'Mulighet',
  [ValidationFieldNames.ENHET]: 'Enhet',
  [ValidationFieldNames.VEDTAK]: 'Vedtak',
  [ValidationFieldNames.OPPGAVE]: 'Gosys-oppgave',
};

export const useFieldName = (field: ValidationFieldNames) => {
  const { type } = useContext(AppContext);

  if (field === ValidationFieldNames.KLAGER) {
    if (type === Type.ANKE) {
      return 'Ankende part';
    }

    return 'Klager';
  }

  return FIELD_NAMES[field] ?? field;
};
