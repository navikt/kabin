import { useRegistrering } from '@app/hooks/use-registrering';
import { SaksTypeEnum } from '@app/types/common';
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
  [ValidationFieldNames.SVARBREV_INPUT]: 'Svarbrev',
  [ValidationFieldNames.GOSYS_OPPGAVE]: 'Oppgave i Gosys',
  [ValidationFieldNames.SVARBREV_RECEIVERS]: 'Mottakere av svarbrev',
};

export const useFieldName = (field: ValidationFieldNames) => {
  const { typeId } = useRegistrering();

  if (field === ValidationFieldNames.KLAGER) {
    if (typeId === SaksTypeEnum.ANKE) {
      return 'Ankende part';
    }

    return 'Klager';
  }

  return FIELD_NAMES[field] ?? field;
};
