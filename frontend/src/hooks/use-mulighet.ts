import { useRegistrering } from '@app/hooks/use-registrering';
import type { Mulighet } from '@app/redux/api/registreringer/types';
import { SaksTypeEnum } from '@app/types/common';
import type { IAnkemulighet, IKlagemulighet } from '@app/types/mulighet';

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
  const { typeId, mulighet, ankemuligheter, klagemuligheter } = useRegistrering();

  const ankemulighet = selectMulighet(ankemuligheter, mulighet);
  const klagemulighet = selectMulighet(klagemuligheter, mulighet);

  if (typeId === SaksTypeEnum.ANKE) {
    return { typeId, mulighet: ankemulighet };
  }

  if (typeId === SaksTypeEnum.KLAGE) {
    return { typeId, mulighet: klagemulighet };
  }

  return { typeId, mulighet: undefined };
};

const selectMulighet = <T extends IKlagemulighet | IAnkemulighet>(
  muligheter: T[],
  mulighet: Mulighet | null,
): T | undefined => (mulighet === null ? undefined : muligheter.find((m) => m.id === mulighet.id));
