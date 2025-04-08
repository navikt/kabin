import {
  type AvsenderMottakerType,
  type IAvsenderMottaker,
  type IPart,
  type IdType,
  PART_TYPES,
} from '@app/types/common';

export const avsenderMottakerToPart = (avsenderMottaker: IAvsenderMottaker | null): IPart | null => {
  if (avsenderMottaker === null) {
    return null;
  }

  return avsenderIsPart(avsenderMottaker) ? avsenderMottaker : null;
};

export const avsenderIsPart = (avsender: { type: IdType | AvsenderMottakerType }) =>
  PART_TYPES.some((t) => t === avsender.type);
