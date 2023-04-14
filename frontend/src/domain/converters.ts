import { IAvsenderMottaker, IPart, IPartId, PART_TYPES } from '@app/types/common';

export const partToPartId = (part: IPart | null): IPartId | null => {
  if (part === null) {
    return null;
  }

  const { id, type } = part;

  return { id, type };
};

export const avsenderMottakerToPartId = (avsenderMottaker: IAvsenderMottaker | null): IPartId | null => {
  if (avsenderMottaker === null) {
    return null;
  }

  return avsenderIsPart(avsenderMottaker) ? partToPartId(avsenderMottaker) : null;
};

export const avsenderMottakerToPart = (avsenderMottaker: IAvsenderMottaker | null): IPart | null => {
  if (avsenderMottaker === null) {
    return null;
  }

  return avsenderIsPart(avsenderMottaker) ? avsenderMottaker : null;
};

export const avsenderIsPart = (avsender: IAvsenderMottaker): avsender is IPart =>
  PART_TYPES.some((t) => t === avsender.type);
