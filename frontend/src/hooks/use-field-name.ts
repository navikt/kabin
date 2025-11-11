import { getKlagerTitle } from '@app/functions/get-klager-name';
import { useRegistrering } from '@app/hooks/use-registrering';
import { ValidationFieldNames } from '@app/types/validation';

export const FIELD_NAMES: Record<Exclude<ValidationFieldNames, ValidationFieldNames.KLAGER>, string> = {
  [ValidationFieldNames.MOTTATT_KLAGEINSTANS]: 'Mottatt klageinstans',
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
  [ValidationFieldNames.REASON_NO_LETTER]: 'Skriv kort hvordan du har varslet på annen måte',
};

export const useFieldName = (field: ValidationFieldNames) => {
  const { typeId } = useRegistrering();

  if (field === ValidationFieldNames.KLAGER) {
    return getKlagerTitle(typeId);
  }

  return FIELD_NAMES[field] ?? field;
};
