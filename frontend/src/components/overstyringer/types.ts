import type { IPart } from '@app/types/common';

export enum FieldNames {
  KLAGER = 'klager',
  FULLMEKTIG = 'fullmektig',
  AVSENDER = 'avsender',
}

export interface BaseProps {
  part: IPart | null;
  partField: FieldNames;
  label: string;
  excludedPartIds?: (string | null | undefined)[];
  icon: React.ReactNode;
}
