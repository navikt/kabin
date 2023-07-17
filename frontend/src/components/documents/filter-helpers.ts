import { isWithinInterval, parseISO } from 'date-fns';
import { useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { isNotNull } from '@app/functions/is-not';
import { stringToRegExp } from '@app/functions/string-to-regex';
import { useKlageenheter, useVedtaksenheter } from '@app/simple-api-state/use-kodeverk';
import { AvsenderMottakerType, skipToken } from '@app/types/common';
import { IArkivertDocument, JournalposttypeEnum } from '@app/types/dokument';

interface IOption<T> {
  value: T;
  label: string;
}

const NONE = 'NONE';
const UNKNOWN = 'UNKNOWN';

export const useAvsenderMottakerNoteurOptions = (documents: IArkivertDocument[]): IOption<string>[] => {
  const { data: klageenheter = [] } = useKlageenheter();
  const { data: vedtaksenheter = [] } = useVedtaksenheter();

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

export const useFilteredDocuments = (
  documents: IArkivertDocument[],
  selectedAvsenderMottakere: string[],
  selectedDateRange: DateRange | undefined,
  selectedSaksIds: string[],
  selectedTemaer: string[],
  selectedTypes: string[],
  search: string,
): IArkivertDocument[] => {
  const regex = useMemo(() => (search.length === 0 ? skipToken : stringToRegExp(search)), [search]);

  return useMemo(
    () =>
      documents.filter(
        ({
          tittel,
          journalpostId,
          temaId,
          journalposttype,
          avsenderMottaker,
          registrert,
          sak,
          vedlegg,
          journalfortAvNavn,
          journalfoerendeEnhet,
        }) =>
          (selectedTemaer.length === 0 || (temaId !== null && selectedTemaer.includes(temaId))) &&
          (selectedTypes.length === 0 || (journalposttype !== null && selectedTypes.includes(journalposttype))) &&
          (selectedAvsenderMottakere.length === 0 ||
            selectedAvsenderMottakere.includes(
              avsenderMottaker?.id ?? journalfortAvNavn ?? journalfoerendeEnhet ?? UNKNOWN,
            )) &&
          (selectedSaksIds.length === 0 || selectedSaksIds.includes(sak === null ? NONE : sak.fagsakId ?? UNKNOWN)) &&
          (selectedDateRange === undefined || checkDateInterval(registrert, selectedDateRange)) &&
          (regex === skipToken || filterDocumentsBySearch(regex, { tittel, journalpostId, vedlegg })),
      ),
    [documents, regex, selectedAvsenderMottakere, selectedDateRange, selectedSaksIds, selectedTemaer, selectedTypes],
  );
};

const checkDateInterval = (date: string, { from, to }: DateRange) => {
  if (from !== undefined && to !== undefined) {
    return isWithinInterval(parseISO(date), { start: from, end: to });
  }

  return true;
};

interface FilterDocument {
  tittel: string | null;
  journalpostId: string;
  vedlegg: { tittel: string | null }[];
}

const filterDocumentsBySearch = (regex: RegExp, { tittel, journalpostId, vedlegg }: FilterDocument) => {
  const vedleggTitler = vedlegg.map((v) => v.tittel).join(' ');
  const searchIn = [tittel, journalpostId, vedleggTitler].filter(isNotNull).join(' ');

  return regex.test(searchIn);
};
