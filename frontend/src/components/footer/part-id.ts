import { IPart, IPartId, PartType } from '@app/types/common';

export const getPartId = (part: IPart | null): IPartId | null => {
  if (part === null) {
    return null;
  }

  if (part.person !== null) {
    return { type: PartType.PERSON, value: part.person.foedselsnummer };
  }

  if (part.virksomhet !== null) {
    return { type: PartType.VIRKSOMHET, value: part.virksomhet.virksomhetsnummer };
  }

  return null;
};
