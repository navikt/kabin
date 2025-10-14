import { useRegistrering } from '@app/hooks/use-registrering';
import type { Mulighet } from '@app/redux/api/registreringer/types';
import { SaksTypeEnum } from '@app/types/common';
import type {
  IAnkemulighet,
  IBegjæringOmGjenopptakMulighet,
  IKlagemulighet,
  IOmgjøringskravmulighet,
} from '@app/types/mulighet';

interface KlageResult {
  typeId: SaksTypeEnum.KLAGE;
  mulighet: IKlagemulighet | undefined;
}

interface AnkeResult {
  typeId: SaksTypeEnum.ANKE;
  mulighet: IAnkemulighet | undefined;
}

interface OmgjøringskravResult {
  typeId: SaksTypeEnum.OMGJØRINGSKRAV;
  mulighet: IOmgjøringskravmulighet | undefined;
}

interface BegjæringOmGjenopptakResult {
  typeId: SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK;
  mulighet: IBegjæringOmGjenopptakMulighet | undefined;
}

interface NoneResult {
  typeId: null;
  mulighet: undefined;
}

export const useMulighet = ():
  | KlageResult
  | AnkeResult
  | OmgjøringskravResult
  | BegjæringOmGjenopptakResult
  | NoneResult => {
  const { typeId, mulighet, ankemuligheter, klagemuligheter, omgjoeringskravmuligheter, gjenopptaksmuligheter } =
    useRegistrering();

  const ankemulighet = selectMulighet(ankemuligheter, mulighet);
  const klagemulighet = selectMulighet(klagemuligheter, mulighet);
  const omgjøringskravmulighet = selectMulighet(omgjoeringskravmuligheter, mulighet);
  const gjenopptaksmulighet = selectMulighet(gjenopptaksmuligheter, mulighet);

  if (typeId === SaksTypeEnum.ANKE) {
    return { typeId, mulighet: ankemulighet };
  }

  if (typeId === SaksTypeEnum.KLAGE) {
    return { typeId, mulighet: klagemulighet };
  }

  if (typeId === SaksTypeEnum.OMGJØRINGSKRAV) {
    return { typeId, mulighet: omgjøringskravmulighet };
  }

  if (typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK) {
    return { typeId, mulighet: gjenopptaksmulighet };
  }

  return { typeId, mulighet: undefined };
};

const selectMulighet = <T extends IKlagemulighet | IAnkemulighet | IBegjæringOmGjenopptakMulighet>(
  muligheter: T[],
  mulighet: Mulighet | null,
): T | undefined => (mulighet === null ? undefined : muligheter.find((m) => m.id === mulighet.id));
