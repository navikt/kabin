import { IPart } from '@app/types/common';

export interface ISetPart {
  label: string;
  title: string;
  defaultPart: IPart | null;
  icon?: React.ReactNode;
}

export interface EnterEditModeCallback {
  enterEditMode?: () => void;
}
