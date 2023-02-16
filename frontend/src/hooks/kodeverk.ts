import { useMemo } from 'react';
import { useSimpleYtelser, useTema, useUtfall } from './../simple-api-state/use-kodeverk';
import { UtfallEnum } from './../types/kodeverk';

export const useUtfallName = (utfallId: UtfallEnum): string => {
  const { data } = useUtfall();

  return useMemo(() => {
    if (typeof data === 'undefined') {
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
