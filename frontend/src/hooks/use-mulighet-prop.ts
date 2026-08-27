import { useAdditionalKabalMulighet } from '@app/hooks/use-additional-kabal-mulighet';
import { useMulighet } from '@app/hooks/use-mulighet';
import { SaksTypeEnum } from '@app/types/common';
import type { IBasemulighet, IBegjæringOmGjenopptakMulighet, OtherMulighet } from '@app/types/mulighet';

export const useBasemulighetProp = <K extends keyof IBasemulighet>(key: K): IBasemulighet[K] | null => {
  const { mulighet, fromJournalpost } = useMulighet();
  const additionalKabalMulighet = useAdditionalKabalMulighet();

  if (fromJournalpost) {
    return null;
  }

  return additionalKabalMulighet?.[key] ?? mulighet?.[key] ?? null;
};

export const useOtherMulighetProp = <K extends keyof OtherMulighet>(
  key: K,
): (OtherMulighet | IBegjæringOmGjenopptakMulighet)[K] | null => {
  const { typeId, mulighet, fromJournalpost } = useMulighet();
  const additionalKabalMulighet = useAdditionalKabalMulighet();

  if (typeId === SaksTypeEnum.KLAGE || fromJournalpost) {
    return null;
  }

  return additionalKabalMulighet?.[key] ?? mulighet?.[key] ?? null;
};
