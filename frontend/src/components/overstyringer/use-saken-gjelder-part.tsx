import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useYtelseId } from '@app/hooks/use-ytelse-id';
import { useLazyGetPartWithUtsendingskanalQuery } from '@app/redux/api/part';
import type { IPart } from '@app/types/common';
import { useState } from 'react';

type LoadedPart = {
  sakenGjelder: IPart;
  isLoading: false;
  error?: never;
  refetch?: never;
};

type LoadingPart = {
  sakenGjelder: null;
  isLoading: true;
  error?: never;
  refetch?: never;
};

type NotFoundPart = {
  sakenGjelder: null;
  isLoading: false;
  refetch: () => void;
  error?: never;
};

type NotEnoughDataPart = {
  sakenGjelder: null;
  isLoading: false;
  error: string;
  refetch?: never;
};

export const useSakenGjelderPart = (): LoadedPart | LoadingPart | NotFoundPart | NotEnoughDataPart => {
  const { sakenGjelderValue } = useRegistrering();
  const { mulighet, fromJournalpost } = useMulighet();
  const ytelseId = useYtelseId();
  const [getPart, { isFetching, isSuccess, isError }] = useLazyGetPartWithUtsendingskanalQuery();
  const [fetchedPart, setFetchedPart] = useState<IPart | null>();

  if (mulighet !== undefined && !fromJournalpost) {
    return { sakenGjelder: mulighet.sakenGjelder, isLoading: false };
  }

  if (sakenGjelderValue === null) {
    return { sakenGjelder: null, isLoading: false, error: 'Mangler saken gjelder' };
  }

  if (ytelseId === null) {
    return { sakenGjelder: null, isLoading: false, error: 'Mangler ytelse' };
  }

  const setPart = async () => {
    const part = await getPart({
      identifikator: sakenGjelderValue,
      sakenGjelderId: sakenGjelderValue,
      ytelseId,
    }).unwrap();

    setFetchedPart(part);
  };

  const initPart = async () => {
    if (isFetching || isSuccess || isError) {
      return;
    }

    setPart();
  };

  initPart();

  const refetchPart = () => {
    if (isFetching) {
      return;
    }

    setPart();
  };

  if (fetchedPart === null) {
    return { sakenGjelder: null, isLoading: false, refetch: refetchPart };
  }

  if (fetchedPart === undefined) {
    return { sakenGjelder: null, isLoading: true };
  }

  return { sakenGjelder: fetchedPart, isLoading: false };
};
