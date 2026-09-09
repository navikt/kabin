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
  fromJournalpost: false;
  mulighet: IKlagemulighet | undefined;
}

interface AnkeResult {
  typeId: SaksTypeEnum.ANKE;
  fromJournalpost: false;
  mulighet: IAnkemulighet | undefined;
}

interface AnkeAfter2027Result {
  typeId: SaksTypeEnum.ANKE_AFTER_2027;
  fromJournalpost: false;
  mulighet: IAnkemulighet | undefined;
}

interface OmgjøringskravResult {
  typeId: SaksTypeEnum.OMGJØRINGSKRAV;
  fromJournalpost: false;
  mulighet: IOmgjøringskravmulighet | undefined;
}

interface BegjæringOmGjenopptakResult {
  typeId: SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK;
  fromJournalpost: false;
  mulighet: IBegjæringOmGjenopptakMulighet | undefined;
}

interface JournalpostmulighetResult {
  typeId: SaksTypeEnum;
  fromJournalpost: true;
  mulighet: Mulighet | undefined;
}

interface NoneResult {
  typeId: null;
  fromJournalpost: false;
  mulighet: undefined;
}

export const useMulighet = ():
  | KlageResult
  | AnkeResult
  | AnkeAfter2027Result
  | OmgjøringskravResult
  | BegjæringOmGjenopptakResult
  | JournalpostmulighetResult
  | NoneResult => {
  const {
    typeId,
    mulighet,
    muligheter: { ankemuligheterFoer2027, klagemuligheter, omgjoeringskravmuligheter, gjenopptaksmuligheter },
    mulighetIsBasedOnJournalpost,
  } = useRegistrering();

  const ankemulighet = selectMulighet(ankemuligheterFoer2027, mulighet);
  const ankeAfter2027mulighet = selectMulighet(ankemuligheterFoer2027, mulighet);
  const klagemulighet = selectMulighet(klagemuligheter, mulighet);
  const omgjøringskravmulighet = selectMulighet(omgjoeringskravmuligheter, mulighet);
  const gjenopptaksmulighet = selectMulighet(gjenopptaksmuligheter, mulighet);

  if (mulighetIsBasedOnJournalpost && typeId !== null) {
    return { typeId, mulighet: mulighet ?? undefined, fromJournalpost: true };
  }

  if (typeId === SaksTypeEnum.ANKE) {
    return { typeId, mulighet: ankemulighet, fromJournalpost: false };
  }

  if (typeId === SaksTypeEnum.ANKE_AFTER_2027) {
    return { typeId, mulighet: ankeAfter2027mulighet, fromJournalpost: false };
  }

  if (typeId === SaksTypeEnum.KLAGE) {
    return { typeId, mulighet: klagemulighet, fromJournalpost: false };
  }

  if (typeId === SaksTypeEnum.OMGJØRINGSKRAV) {
    return { typeId, mulighet: omgjøringskravmulighet, fromJournalpost: false };
  }

  if (typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK) {
    return { typeId, mulighet: gjenopptaksmulighet, fromJournalpost: false };
  }

  return { typeId, mulighet: undefined, fromJournalpost: false };
};

const selectMulighet = <
  T extends IKlagemulighet | IAnkemulighet | IBegjæringOmGjenopptakMulighet | IOmgjøringskravmulighet,
>(
  muligheter: T[],
  mulighet: Mulighet | null,
): T | undefined => (mulighet === null ? undefined : muligheter.find((m) => m.id === mulighet.id));
