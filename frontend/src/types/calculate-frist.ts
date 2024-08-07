export enum BehandlingstidUnitType {
  WEEKS = '1',
  MONTHS = '2',
}

export const BEHANDLINGSTID_UNIT_TYPES = Object.values(BehandlingstidUnitType);

export const BEHANDLINGSTID_UNIT_TYPE_NAMES: Record<BehandlingstidUnitType, string> = {
  [BehandlingstidUnitType.WEEKS]: 'uker',
  [BehandlingstidUnitType.MONTHS]: 'måneder',
};

export const isVarsletBehandlingstidUnitType = (value: string): value is BehandlingstidUnitType =>
  BEHANDLINGSTID_UNIT_TYPES.some((t) => t === value);
