import { IAnkemulighet, IKlagemulighet } from '@app/types/mulighet';

type Mulighet = IAnkemulighet | IKlagemulighet;

export const compareMuligheter = <T extends Mulighet>(a: T | null, b: T | null): boolean => {
  if (a === null && b === null) {
    return true;
  }

  if (a === null || b === null) {
    return false;
  }

  const baseEquals =
    a.vedtakDate === b.vedtakDate &&
    a.sakenGjelder?.id === b.sakenGjelder.id &&
    a.fagsakId === b.fagsakId &&
    a.originalFagsystemId === b.originalFagsystemId;

  if (!baseEquals) {
    return false;
  }

  const aIsAnke = isAnkeMulighet(a);
  const bIsAnke = isAnkeMulighet(b);

  if (aIsAnke && bIsAnke) {
    return a.klager === b.klager && a.ytelseId === b.ytelseId && a.klager === b.klager && a.fullmektig === b.fullmektig;
  }

  if (aIsAnke || bIsAnke) {
    return false;
  }

  return a.temaId === b.temaId && a.klageBehandlendeEnhet === b.klageBehandlendeEnhet;
};

const isAnkeMulighet = (mulighet: Mulighet): mulighet is IAnkemulighet => 'klager' in mulighet;
