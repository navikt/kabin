import { IPart } from '@app/types/common';

export const compareParts = (a: IPart | null, b: IPart | null): boolean => {
  if (a === null && b === null) {
    return true;
  }

  if (a === null || b === null) {
    return false;
  }

  return a.type === b.type && a.id === b.id;
};
