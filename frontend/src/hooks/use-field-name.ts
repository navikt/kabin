export enum ValidationFieldNames {
  MOTTATT_NAV = 'mottattNav',
  FRIST = 'frist',
  AVSENDER = 'avsender',
}

const FIELD_NAMES: Record<ValidationFieldNames, string> = {
  [ValidationFieldNames.MOTTATT_NAV]: 'Mottatt NAV Klageinstans',
  [ValidationFieldNames.FRIST]: 'Frist',
  [ValidationFieldNames.AVSENDER]: 'Avsender',
};

export const useFieldName = (field: ValidationFieldNames) => FIELD_NAMES[field] ?? field;
