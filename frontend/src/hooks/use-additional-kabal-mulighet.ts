import { useRegistrering } from '@app/hooks/use-registrering';
import type { IAdditionalKabalMulighet } from '@app/types/mulighet';

export const useAdditionalKabalMulighet = (): IAdditionalKabalMulighet | null => {
  const { additionalKabalMulighet, additionalKabalMuligheter } = useRegistrering();

  if (additionalKabalMulighet === null) {
    return null;
  }

  return additionalKabalMuligheter.find((m) => m.id === additionalKabalMulighet.id) ?? null;
};
