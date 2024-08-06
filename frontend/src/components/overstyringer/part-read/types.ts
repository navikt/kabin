import { IPart } from '@app/types/common';

export interface ISetPart<T extends IPart | null = IPart> {
  label: string;
  title: string;
  defaultPart: T;
  icon?: React.ReactNode;
}

export interface EnterSearchModeCallback {
  enterSearchMode?: () => void;
}
