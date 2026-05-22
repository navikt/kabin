import { useAdditionalKabalMulighet } from '@app/hooks/use-additional-kabal-mulighet';
import { useMulighet } from '@app/hooks/use-mulighet';
import { SaksTypeEnum } from '@app/types/common';
import type {
  IAdditionalKabalMulighet,
  IAnkemulighet,
  IBasemulighet,
  IBegjæringOmGjenopptakMulighet,
  IOmgjøringskravmulighet,
} from '@app/types/mulighet';

type NonKlagemulighet =
  | IAnkemulighet
  | IOmgjøringskravmulighet
  | IBegjæringOmGjenopptakMulighet
  | IAdditionalKabalMulighet;

export const useBasemulighetProp = <K extends keyof IBasemulighet>(key: K): IBasemulighet[K] | null => {
  const { mulighet, fromJournalpost } = useMulighet();
  const additionalKabalMulighet = useAdditionalKabalMulighet();

  if (fromJournalpost) {
    return null;
  }

  return additionalKabalMulighet?.[key] ?? mulighet?.[key] ?? null;
};

export const useNonKlagemulighetProp = <K extends keyof NonKlagemulighet>(key: K): NonKlagemulighet[K] | null => {
  const { typeId, mulighet, fromJournalpost } = useMulighet();
  const additionalKabalMulighet = useAdditionalKabalMulighet();

  if (typeId === SaksTypeEnum.KLAGE || fromJournalpost) {
    return null;
  }

  return additionalKabalMulighet?.[key] ?? mulighet?.[key] ?? null;
};
