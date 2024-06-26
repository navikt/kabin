import { useMemo } from 'react';
import {
  useFagsystemer,
  useHjemlerMap,
  useSimpleYtelser,
  useTema,
  useVedtaksenheter,
} from '@app/simple-api-state/use-kodeverk';

export const useFullTemaNameFromId = (temaId?: string | null): string => {
  const { data, isLoading } = useTema();

  if (isLoading || data === undefined) {
    return 'Laster...';
  }

  if (typeof temaId === 'string') {
    return data.find(({ id }) => id === temaId)?.beskrivelse ?? temaId;
  }

  return 'Mangler';
};

export const useTemaName = (temaId?: string | null): [string | undefined, boolean] => {
  const { data, isLoading } = useTema();

  return useMemo(() => {
    if (isLoading || data === undefined) {
      return [undefined, true];
    }

    return [data.find(({ id }) => id === temaId)?.navn, false];
  }, [data, isLoading, temaId]);
};

export const useYtelseName = (ytelseId?: string | null): string => {
  const { data } = useSimpleYtelser();

  return useMemo(() => {
    if (data === undefined) {
      return '';
    }

    return data.find(({ id }) => id === ytelseId)?.navn ?? ytelseId ?? '';
  }, [data, ytelseId]);
};

export const useVedtaksenhetName = (vedtaksenhetId?: string | null): string => {
  const { data } = useVedtaksenheter();

  return useMemo(() => {
    if (data === undefined) {
      return '';
    }

    return data.find(({ id }) => id === vedtaksenhetId)?.navn ?? vedtaksenhetId ?? '';
  }, [data, vedtaksenhetId]);
};

export const useFagsystemName = (fagsystemId?: string | null): string => {
  const { data } = useFagsystemer();

  return useMemo(() => {
    if (data === undefined) {
      return '';
    }

    return data.find(({ id }) => id === fagsystemId)?.beskrivelse ?? fagsystemId ?? '';
  }, [data, fagsystemId]);
};

export const useHjemmelName = (hjemmelId: string): string => {
  const { data = {} } = useHjemlerMap();

  if (data === undefined) {
    return '';
  }

  return data[hjemmelId] ?? hjemmelId;
};
