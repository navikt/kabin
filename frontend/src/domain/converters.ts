import { IPartId, IdType, PartType } from '@app/types/common';
import { IAvsenderMottaker } from '@app/types/dokument';

export const avsenderMottakerToPartId = (avsenderMottaker: IAvsenderMottaker | null): IPartId | null => {
  if (avsenderMottaker === null) {
    return null;
  }

  if (avsenderMottaker.type === IdType.ORGNR || avsenderMottaker.type === IdType.UTL_ORG) {
    return {
      type: PartType.VIRKSOMHET,
      value: avsenderMottaker.id,
    };
  }

  return {
    type: PartType.PERSON,
    value: avsenderMottaker.id,
  };
};
