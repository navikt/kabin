import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import type { IGetOppgaverParams } from '@app/redux/api/oppgaver';
import { SaksTypeEnum } from '@app/types/common';
import { FagsystemId, type IAnkemulighet, type IKlagemulighet } from '@app/types/mulighet';
import { skipToken } from '@reduxjs/toolkit/query/react';

export const useParams = (): IGetOppgaverParams | typeof skipToken => {
  const { sakenGjelderValue } = useRegistrering();
  const { typeId, mulighet } = useMulighet();

  if (typeId === null || sakenGjelderValue === null) {
    return skipToken;
  }

  if (!oppgaverIsEnabled(typeId, mulighet)) {
    return skipToken;
  }

  if (mulighet !== undefined) {
    return { identifikator: sakenGjelderValue, temaId: mulighet.temaId };
  }

  return { identifikator: sakenGjelderValue };
};

const oppgaverIsEnabled = (typeId: SaksTypeEnum, mulighet: IKlagemulighet | IAnkemulighet | undefined) => {
  if (mulighet === undefined) {
    return false;
  }

  if (typeId === SaksTypeEnum.KLAGE) {
    return true;
  }

  if (typeId === SaksTypeEnum.ANKE && mulighet.originalFagsystemId === FagsystemId.INFOTRYGD) {
    return true;
  }

  return false;
};
