import { skipToken } from '@reduxjs/toolkit/query/react';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetAnkemulighetQuery, useGetKlagemulighetQuery } from '@app/redux/api/muligheter';
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
  const { id, typeId, mulighet } = useRegistrering();

  const hasMulighet = mulighet !== null;

  const { data: ankemulighet } = useGetAnkemulighetQuery(hasMulighet && typeId === SaksTypeEnum.ANKE ? id : skipToken);

  const { data: klagemulighet } = useGetKlagemulighetQuery(
    hasMulighet && typeId === SaksTypeEnum.KLAGE ? id : skipToken,
  );

  if (typeId === SaksTypeEnum.ANKE) {
    return { typeId, mulighet: ankemulighet };
  }

  if (typeId === SaksTypeEnum.KLAGE) {
    return { typeId, mulighet: klagemulighet };
  }

  return { typeId, mulighet: undefined };
};
