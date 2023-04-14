export enum ValidationFieldNames {
  MOTTATT_KLAGEINSTANS = 'mottattKlageinstans',
  MOTTATT_VEDTAKSINSTANS = 'mottattVedtaksinstans',
  FRIST = 'frist',
  AVSENDER = 'avsender',
}

export const FIELD_NAMES: Record<ValidationFieldNames, string> = {
  [ValidationFieldNames.MOTTATT_KLAGEINSTANS]: 'Mottatt Klageinstans',
  [ValidationFieldNames.MOTTATT_VEDTAKSINSTANS]: 'Mottatt vedtaksinstans',
  [ValidationFieldNames.FRIST]: 'Frist',
  [ValidationFieldNames.AVSENDER]: 'Avsender',
};

export const useFieldName = (field: ValidationFieldNames) => FIELD_NAMES[field] ?? field;
