import React from 'react';
import { IPart } from '@app/types/common';

export enum GridArea {
  SAKEN_GJELDER = 'sakengjelder',
  KLAGER = 'klager',
  FULLMEKTIG = 'fullmektig',
  AVSENDER = 'avsender',
}

export enum FieldNames {
  SAKEN_GJELDER = 'sakenGjelder',
  KLAGER = 'klager',
  FULLMEKTIG = 'fullmektig',
  AVSENDER = 'avsender',
}

export interface BaseProps {
  part: IPart | null;
  partField: FieldNames;
  label: string;
  gridArea: GridArea;
  icon: React.ReactNode;
}
