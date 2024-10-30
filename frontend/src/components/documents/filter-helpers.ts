import { fuzzySearch } from '@app/components/fuzzy-search/fuzzy-search';
import { splitQuery } from '@app/components/fuzzy-search/split-query';
import { useGetKlageenheterQuery, useGetVedtaksenheterQuery } from '@app/redux/api/kodeverk';
import { AvsenderMottakerType, type DateRange } from '@app/types/common';
import { type IArkivertDocument, type IVedlegg, JournalposttypeEnum } from '@app/types/dokument';
import { isWithinInterval, parseISO } from 'date-fns';
import { useMemo } from 'react';

interface IOption<T> {
  value: T;
  label: string;
}

const NONE = 'NONE';
const UNKNOWN = 'UNKNOWN';

export const useAvsenderMottakerNoteurOptions = (documents: IArkivertDocument[]): IOption<string>[] => {
  const { data: klageenheter = [] } = useGetKlageenheterQuery();
  const { data: vedtaksenheter = [] } = useGetVedtaksenheterQuery();

  return useMemo(
    () =>
      documents.reduce<IOption<string>[]>(
        (acc, { avsenderMottaker, journalfortAvNavn, journalfoerendeEnhet, journalposttype }) => {
          if (avsenderMottaker !== null) {
            const { name: navn, id, type } = avsenderMottaker;

            if (type === AvsenderMottakerType.NULL) {
              return acc;
            }

            const label = navn ?? id ?? 'Ukjent';
            const value = id ?? UNKNOWN;

            if (acc.some((am) => am.value === value)) {
              return acc;
            }

            acc.push({ label, value });

            return acc;
          }

          if (journalposttype !== JournalposttypeEnum.NOTAT) {
            return acc;
          }

          if (journalfortAvNavn !== null) {
            const label = journalfortAvNavn;
            const value = journalfortAvNavn;

            if (acc.some((am) => am.value === value)) {
              return acc;
            }

            acc.push({ label, value });

            return acc;
          }

          if (journalfoerendeEnhet !== null) {
            const label = journalfoerendeEnhet;
            const value =
              klageenheter.find((k) => k.id === journalfoerendeEnhet)?.navn ??
              vedtaksenheter.find((v) => v.id === journalfoerendeEnhet)?.navn ??
              'Ukjent';

            if (acc.some((am) => am.value === value)) {
              return acc;
            }

            acc.push({ label, value });

            return acc;
          }

          if (acc.every((am) => am.value !== NONE)) {
            acc.push({ label: 'Ingen', value: NONE });
          }

          return acc;
        },
        [],
      ),
    [documents, klageenheter, vedtaksenheter],
  );
};

export const getSaksIdOptions = (documents: IArkivertDocument[]): IOption<string>[] =>
  documents.reduce<IOption<string>[]>((acc, { sak }) => {
    if (sak === null) {
      if (acc.every((am) => am.value !== NONE)) {
        acc.push({ label: 'Ingen', value: NONE });
      }

      return acc;
    }

    const { fagsakId } = sak;

    const label = fagsakId ?? 'Ukjent';
    const value = fagsakId ?? UNKNOWN;

    if (acc.some((am) => am.value === value)) {
      return acc;
    }

    acc.push({ label, value });

    return acc;
  }, []);

interface ScoredVedlegg extends IVedlegg {
  score: number;
}

interface ScoredArkivertDocument extends IArkivertDocument {
  score: number;
  vedlegg: ScoredVedlegg[];
}

export const useFilteredDocuments = (
  documents: IArkivertDocument[],
  selectedAvsenderMottakere: string[],
  selectedDateRange: DateRange | undefined,
  selectedSaksIds: string[],
  selectedTemaer: string[],
  selectedTypes: string[],
  search: string,
): IArkivertDocument[] =>
  useMemo(() => {
    const filtered = documents.filter(
      ({ temaId, journalposttype, avsenderMottaker, datoOpprettet, sak, journalfortAvNavn, journalfoerendeEnhet }) =>
        (selectedTemaer.length === 0 || (temaId !== null && selectedTemaer.includes(temaId))) &&
        (selectedTypes.length === 0 || (journalposttype !== null && selectedTypes.includes(journalposttype))) &&
        (selectedAvsenderMottakere.length === 0 ||
          selectedAvsenderMottakere.includes(
            avsenderMottaker?.id ?? journalfortAvNavn ?? journalfoerendeEnhet ?? UNKNOWN,
          )) &&
        (selectedSaksIds.length === 0 || selectedSaksIds.includes(sak === null ? NONE : (sak.fagsakId ?? UNKNOWN))) &&
        (selectedDateRange === undefined || checkDateInterval(datoOpprettet, selectedDateRange)),
    );

    if (search.length === 0) {
      return filtered;
    }

    const scored: ScoredArkivertDocument[] = [];

    for (const doc of filtered) {
      const vedlegg: ScoredVedlegg[] = [];
      let highestVedleggScore = 0;
      const journalpostScore = fuzzySearch(splitQuery(search), (doc.tittel ?? '') + doc.journalpostId);

      for (const v of doc.vedlegg) {
        const vedleggScore = fuzzySearch(splitQuery(search), v.tittel ?? '');

        if (vedleggScore > highestVedleggScore) {
          highestVedleggScore = vedleggScore;
        }

        if (journalpostScore > 0 || vedleggScore > 0) {
          vedlegg.push({ ...v, score: vedleggScore });
        }
      }

      const score = Math.max(journalpostScore, highestVedleggScore);

      if (score > 0) {
        scored.push({ ...doc, score, vedlegg: vedlegg.toSorted((a, b) => b.score - a.score) });
      }
    }

    return scored.toSorted((a, b) => b.score - a.score);
  }, [documents, search, selectedAvsenderMottakere, selectedDateRange, selectedSaksIds, selectedTemaer, selectedTypes]);

const checkDateInterval = (date: string, { from, to }: DateRange) => {
  if (from !== undefined && to !== undefined) {
    return isWithinInterval(parseISO(date), { start: from, end: to });
  }

  return true;
};
