import { getFullName } from '@app/domain/name';
import { IPart, IdType } from '@app/types/common';
import { IAvsenderMottaker } from '@app/types/dokument';

export const partToAvsender = (part: IPart): IAvsenderMottaker | null => {
  if (part.person !== null) {
    return {
      id: part.person.foedselsnummer,
      type: IdType.FNR,
      navn: getFullName(part.person.navn),
    };
  }

  if (part.virksomhet !== null) {
    return {
      id: part.virksomhet.virksomhetsnummer,
      type: IdType.ORGNR,
      navn: part.virksomhet.navn,
    };
  }

  return null;
};
