export enum BehandlingstidUnitType {
  WEEKS = 'WEEKS',
  MONTHS = 'MONTHS',
}

export const BEHANDLINGSTID_UNIT_TYPES = Object.values(BehandlingstidUnitType);

export const BEHANDLINGSTID_UNIT_TYPE_NAMES: Record<BehandlingstidUnitType, string> = {
  [BehandlingstidUnitType.WEEKS]: 'Uker',
  [BehandlingstidUnitType.MONTHS]: 'Måneder',
};

export const isVarsletBehandlingstidUnitType = (value: string): value is BehandlingstidUnitType =>
  BEHANDLINGSTID_UNIT_TYPES.some((t) => t === value);

export interface CalculateFristdatoParams {
  fromDate: string; // LocalDate
  varsletBehandlingstidUnits: number;
  varsletBehandlingstidUnitType: BehandlingstidUnitType;
}
