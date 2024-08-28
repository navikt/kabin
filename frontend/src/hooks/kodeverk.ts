import {
  useGetFagsystemerQuery,
  useGetHjemlerMapQuery,
  useGetSimpleYtelserQuery,
  useGetTemaQuery,
  useGetVedtaksenheterQuery,
} from '@app/redux/api/kodeverk';
import { useMemo } from 'react';

export const useFullTemaNameFromId = (temaId?: string | null): string => {
  const { data, isLoading } = useGetTemaQuery();

  if (isLoading || data === undefined) {
    return 'Laster...';
  }

  if (typeof temaId === 'string') {
    return data.find(({ id }) => id === temaId)?.beskrivelse ?? temaId;
  }

  return 'Mangler';
};

export const useTemaName = (temaId?: string | null): [string | undefined, boolean] => {
  const { data, isLoading } = useGetTemaQuery();

  return useMemo(() => {
    if (isLoading || data === undefined) {
      return [undefined, true];
    }

    return [data.find(({ id }) => id === temaId)?.navn, false];
  }, [data, isLoading, temaId]);
};

export const useYtelseName = (ytelseId?: string | null): string | undefined => {
  const { data, isSuccess } = useGetSimpleYtelserQuery();

  return useMemo(() => {
    if (!isSuccess) {
      return '';
    }

    return data.find(({ id }) => id === ytelseId)?.navn;
  }, [data, isSuccess, ytelseId]);
};

export const useVedtaksenhetName = (vedtaksenhetId?: string | null): string => {
  const { data } = useGetVedtaksenheterQuery();

  return useMemo(() => {
    if (data === undefined) {
      return '';
    }

    return data.find(({ id }) => id === vedtaksenhetId)?.navn ?? vedtaksenhetId ?? '';
  }, [data, vedtaksenhetId]);
};

export const useFagsystemName = (fagsystemId?: string | null): string => {
  const { data } = useGetFagsystemerQuery();

  return useMemo(() => {
    if (data === undefined) {
      return '';
    }

    return data.find(({ id }) => id === fagsystemId)?.beskrivelse ?? fagsystemId ?? '';
  }, [data, fagsystemId]);
};

export const useHjemmelName = (hjemmelId: string): string => {
  const { data = {} } = useGetHjemlerMapQuery();

  if (data === undefined) {
    return '';
  }

  return data[hjemmelId] ?? hjemmelId;
};
