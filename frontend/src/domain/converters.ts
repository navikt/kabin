import { IAvsenderMottaker, IPart, PART_TYPES } from '@app/types/common';

export const avsenderMottakerToPart = (avsenderMottaker: IAvsenderMottaker | null): IPart | null => {
  if (avsenderMottaker === null) {
    return null;
  }

  return avsenderIsPart(avsenderMottaker) ? avsenderMottaker : null;
};

export const avsenderIsPart = (avsender: IAvsenderMottaker): avsender is IPart =>
  PART_TYPES.some((t) => t === avsender.type);
