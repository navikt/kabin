import { useMemo } from 'react';
import {
  useFagsystemer,
  useHjemlerMap,
  useSimpleYtelser,
  useTema,
  useUtfall,
  useVedtaksenheter,
} from '@app/simple-api-state/use-kodeverk';
import { UtfallEnum } from '@app/types/kodeverk';

export const useUtfallName = (utfallId: UtfallEnum | null): string => {
  const { data } = useUtfall();

  return useMemo(() => {
    if (utfallId === null || typeof data === 'undefined') {
      return '';
    }

    return data.find(({ id }) => id === utfallId)?.navn ?? utfallId;
  }, [data, utfallId]);
};

export const useFullTemaNameFromId = (temaId?: string | null): string => {
  const { data, isLoading } = useTema();

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (typeof temaId === 'string') {
    return data.find(({ id }) => id === temaId)?.beskrivelse ?? temaId;
  }

  return 'Mangler';
};

export const useYtelseName = (ytelseId?: string | null): string => {
  const { data } = useSimpleYtelser();

  return useMemo(() => {
    if (typeof data === 'undefined') {
      return '';
    }

    return data.find(({ id }) => id === ytelseId)?.navn ?? ytelseId ?? '';
  }, [data, ytelseId]);
};

export const useVedtaksenhetName = (vedtaksenhetId?: string | null): string => {
  const { data } = useVedtaksenheter();

  return useMemo(() => {
    if (typeof data === 'undefined') {
      return '';
    }

    return data.find(({ id }) => id === vedtaksenhetId)?.navn ?? vedtaksenhetId ?? '';
  }, [data, vedtaksenhetId]);
};

export const useFagsystemName = (fagsystemId?: string | null): string => {
  const { data } = useFagsystemer();

  return useMemo(() => {
    if (typeof data === 'undefined') {
      return '';
    }

    return data.find(({ id }) => id === fagsystemId)?.beskrivelse ?? fagsystemId ?? '';
  }, [data, fagsystemId]);
};

export const useHjemmelName = (hjemmelId: string): string => {
  const { data = {} } = useHjemlerMap();

  if (typeof data === 'undefined') {
    return '';
  }

  return data[hjemmelId] ?? hjemmelId;
};
