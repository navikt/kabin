export enum FieldNames {
  MOTTATT_NAV = 'mottattNav',
  FRIST = 'frist',
}

const FIELD_NAMES: Record<FieldNames, string> = {
  [FieldNames.MOTTATT_NAV]: 'Mottatt NAV',
  [FieldNames.FRIST]: 'Frist',
};

export const useFieldName = (field: FieldNames) => FIELD_NAMES[field] ?? field;
