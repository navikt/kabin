import type { IPart, ISimplePart } from '@app/types/common';

interface CommonProps {
  label: string;
  title: string;
  icon?: React.ReactNode;
}

export interface ISetPart<T extends IPart | null = IPart> extends CommonProps {
  defaultPart: T;
}

export interface ISetAvsender extends CommonProps {
  defaultPart: ISimplePart | null;
}

export interface EnterSearchModeCallback {
  enterSearchMode?: () => void;
}
