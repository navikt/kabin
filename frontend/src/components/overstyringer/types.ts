import React from 'react';
import { IPart } from '@app/types/common';

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
  icon: React.ReactNode;
}
