import { skipToken } from '@reduxjs/toolkit/query/react';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetAnkemuligheterQuery, useGetKlagemuligheterQuery } from '@app/redux/api/muligheter';
import { SaksTypeEnum } from '@app/types/common';
import { IAnkemulighet, IKlagemulighet } from '@app/types/mulighet';

interface KlageResult {
  typeId: SaksTypeEnum.KLAGE;
  mulighet: IKlagemulighet | undefined;
}

interface AnkeResult {
  typeId: SaksTypeEnum.ANKE;
  mulighet: IAnkemulighet | undefined;
}

interface NoneResult {
  typeId: null;
  mulighet: undefined;
}

export const useMulighet = (): KlageResult | AnkeResult | NoneResult => {
  const { sakenGjelderValue, typeId, mulighet } = useRegistrering();

  const hasMulighet = mulighet !== null;
  const hasSakenGJelder = sakenGjelderValue !== null;

  const { ankemulighet } = useGetAnkemuligheterQuery(
    hasMulighet && hasSakenGJelder && typeId === SaksTypeEnum.ANKE ? sakenGjelderValue : skipToken,
    { selectFromResult: ({ data, ...rest }) => ({ ankemulighet: selectMulighet(data, mulighet), ...rest }) },
  );

  const { klagemulighet } = useGetKlagemuligheterQuery(
    hasMulighet && hasSakenGJelder && typeId === SaksTypeEnum.KLAGE ? sakenGjelderValue : skipToken,
    { selectFromResult: ({ data, ...rest }) => ({ klagemulighet: selectMulighet(data, mulighet), ...rest }) },
  );

  if (typeId === SaksTypeEnum.ANKE) {
    return { typeId, mulighet: ankemulighet };
  }

  if (typeId === SaksTypeEnum.KLAGE) {
    return { typeId, mulighet: klagemulighet };
  }

  return { typeId, mulighet: undefined };
};

const selectMulighet = <T extends IKlagemulighet | IAnkemulighet>(
  muligheter: T[] | undefined,
  mulighetId: string | null,
): T | undefined =>
  mulighetId === null || muligheter === undefined ? undefined : muligheter.find((m) => m.id === mulighetId);
