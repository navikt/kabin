import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetFagsystemerQuery } from '@app/redux/api/kodeverk';
import type { IGetGosysOppgaverParams } from '@app/redux/api/oppgaver';
import { SaksTypeEnum } from '@app/types/common';
import { FagsystemId } from '@app/types/mulighet';
import { skipToken } from '@reduxjs/toolkit/query/react';

export const useParams = (): IGetGosysOppgaverParams | typeof skipToken => {
  const { sakenGjelderValue } = useRegistrering();
  const { mulighet } = useMulighet();

  if (sakenGjelderValue === null) {
    return skipToken;
  }

  if (mulighet !== undefined) {
    return { identifikator: sakenGjelderValue, temaId: mulighet.temaId };
  }

  return { identifikator: sakenGjelderValue };
};

export const useIsEnabled = () => {
  const { typeId, mulighet } = useMulighet();
  const { data: fagsystemer = [] } = useGetFagsystemerQuery();

  if (typeId === null || mulighet === undefined) {
    return false;
  }

  const fagsystem = fagsystemer.find(({ id }) => id === mulighet.originalFagsystemId);

  if (fagsystem === undefined || fagsystem.modernized) {
    return false;
  }

  if (typeId === SaksTypeEnum.KLAGE || typeId === SaksTypeEnum.OMGJØRINGSKRAV) {
    return true;
  }

  if (typeId === SaksTypeEnum.ANKE && mulighet.originalFagsystemId === FagsystemId.INFOTRYGD) {
    return true;
  }

  return false;
};
