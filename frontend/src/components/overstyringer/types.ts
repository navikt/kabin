import { IPart } from '../../types/common';

export enum GridArea {
  SAKEN_GJELDER = 'sakengjelder',
  ANKER = 'anker',
  FULLMEKTIG = 'fullmektig',
}

export const gridAreas = Object.values(GridArea);

export interface BaseProps {
  label: string;
  gridArea: GridArea;
}

export interface PartSearchProps {
  part: IPart | null;
  setPart: (part: IPart | null) => void;
}
