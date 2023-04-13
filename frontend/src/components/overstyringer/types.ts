import React from 'react';
import { IAnkeMulighet } from '@app/types/ankemulighet';
import { IPart } from '@app/types/common';

export enum GridArea {
  SAKEN_GJELDER = 'sakengjelder',
  ANKER = 'anker',
  FULLMEKTIG = 'fullmektig',
  AVSENDER = 'avsender',
}

export enum FieldNames {
  SAKEN_GJELDER = 'sakenGjelder',
  KLAGER = 'klager',
  FULLMEKTIG = 'fullmektig',
  AVSENDER = 'avsender',
}

type FieldIds = keyof Pick<IAnkeMulighet, FieldNames.KLAGER | FieldNames.FULLMEKTIG | FieldNames.SAKEN_GJELDER>;

export interface BaseProps {
  label: string;
  partField: FieldIds;
  gridArea: GridArea;
  icon: React.ReactNode;
}

export interface PartSearchProps {
  part: IPart | null;
  setPart: (part: IPart | null) => void;
}
