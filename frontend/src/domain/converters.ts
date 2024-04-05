import { IAvsenderMottaker, IPart, IPartId, PART_TYPES } from '@app/types/common';

export const nullablePartToPartId = (part: IPart | null): IPartId | null => {
  if (part === null) {
    return null;
  }

  return partToPartId(part);
};

export const partToPartId = (part: IPart): IPartId => {
  const { id, type } = part;

  return { id, type };
};

export const avsenderMottakerToPartId = (avsenderMottaker: IAvsenderMottaker | null): IPartId | null => {
  if (avsenderMottaker === null) {
    return null;
  }

  return avsenderIsPart(avsenderMottaker) ? nullablePartToPartId(avsenderMottaker) : null;
};

export const avsenderMottakerToPart = (avsenderMottaker: IAvsenderMottaker | null): IPart | null => {
  if (avsenderMottaker === null) {
    return null;
  }

  return avsenderIsPart(avsenderMottaker) ? avsenderMottaker : null;
};

export const avsenderIsPart = (avsender: IAvsenderMottaker): avsender is IPart =>
  PART_TYPES.some((t) => t === avsender.type);
