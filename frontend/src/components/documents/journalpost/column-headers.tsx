import { DateFilter } from '@app/components/documents/journalpost/date-filter';
import {
  getSaksIdOptions,
  useAvsenderMottakerNoteurOptions,
  useFagsystemOptions,
} from '@app/components/documents/journalpost/filter-helpers';
import { GridArea, GridSearch, StyledGrid } from '@app/components/documents/journalpost/styled-grid-components';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { useGetTemaQuery } from '@app/redux/api/kodeverk';
import type { DateRange } from '@app/types/common';
import { type IArkivertDocument, JournalposttypeEnum } from '@app/types/dokument';
import {
  ArrowCirclepathIcon,
  ArrowsCirclepathIcon,
  ChevronDownDoubleIcon,
  ChevronUpDoubleIcon,
} from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { useMemo } from 'react';

const EMPTY_LIST: [] = [];

const JOURNALPOSTTYPE_OPTIONS = [
  { label: 'Inngående', value: JournalposttypeEnum.INNGAAENDE },
  { label: 'Utgående', value: JournalposttypeEnum.UTGAAENDE },
  { label: 'Notat', value: JournalposttypeEnum.NOTAT },
];

interface Props {
  documents: IArkivertDocument[];
  isLoading: boolean;
  refetch: () => void;
  canRefetch: boolean;
  search: string;
  setSearch: (search: string) => void;
  selectedTemaer: string[];
  setSelectedTemaer: (value: string[]) => void;
  selectedTypes: string[];
  setSelectedTypes: (value: string[]) => void;
  selectedAvsenderMottakere: string[];
  setSelectedAvsenderMottakere: (value: string[]) => void;
  selectedSaksIds: string[];
  setSelectedSaksIds: (value: string[]) => void;
  selectedFagsystemIds: string[];
  setSelectedFagsystemIds: (value: string[]) => void;
  selectedDateRange: DateRange | undefined;
  setSelectedDateRange: (range: DateRange | undefined) => void;
  someExpanded: boolean;
  toggleExpandAll: () => void;
}

export const ColumnHeaders = ({
  documents,
  isLoading,
  refetch,
  canRefetch,
  search,
  setSearch,
  selectedAvsenderMottakere,
  selectedDateRange,
  selectedSaksIds,
  selectedTemaer,
  selectedTypes,
  selectedFagsystemIds,
  setSelectedAvsenderMottakere,
  setSelectedDateRange,
  setSelectedSaksIds,
  setSelectedTemaer,
  setSelectedTypes,
  setSelectedFagsystemIds,
  someExpanded,
  toggleExpandAll,
}: Props) => {
  const { data: allTemaer } = useGetTemaQuery();

  const temaOptions = useMemo(
    () => (allTemaer === undefined ? EMPTY_LIST : allTemaer.map((t) => ({ value: t.id, label: t.beskrivelse }))),
    [allTemaer],
  );

  const fagsystemOptions = useFagsystemOptions(documents);
  const avsenderMottakerOptions = useAvsenderMottakerNoteurOptions(documents);
  const saksIdOptions = useMemo(() => getSaksIdOptions(documents), [documents]);

  const resetFilters = () => {
    setSearch('');
    setSelectedTemaer([]);
    setSelectedTypes([]);
    setSelectedAvsenderMottakere([]);
    setSelectedSaksIds([]);
    setSelectedDateRange(undefined);
    setSelectedFagsystemIds([]);
  };

  const resetFiltersDisabled = useMemo(
    () =>
      search.length === 0 &&
      selectedTemaer.length === 0 &&
      selectedTypes.length === 0 &&
      selectedAvsenderMottakere.length === 0 &&
      selectedSaksIds.length === 0 &&
      selectedDateRange === undefined &&
      selectedFagsystemIds.length === 0,
    [
      search.length,
      selectedAvsenderMottakere.length,
      selectedDateRange,
      selectedSaksIds.length,
      selectedTemaer.length,
      selectedTypes.length,
      selectedFagsystemIds.length,
    ],
  );

  return (
    <>
      <HStack gap="space-8" align="center">
        <Button
          className="w-50"
          size="small"
          variant="secondary-neutral"
          onClick={resetFilters}
          disabled={resetFiltersDisabled}
          icon={<ArrowCirclepathIcon aria-hidden />}
        >
          Fjern filtere
        </Button>

        {canRefetch ? (
          <Button
            data-color="neutral"
            size="small"
            variant="tertiary"
            onClick={() => refetch()}
            loading={isLoading}
            icon={<ArrowsCirclepathIcon aria-hidden />}
            title="Oppdater"
          />
        ) : null}
      </HStack>
      <StyledGrid as="section" aria-label="Journalpostfiltere">
        <Button
          data-color="neutral"
          style={{ gridArea: GridArea.EXPAND }}
          size="small"
          variant="tertiary"
          icon={someExpanded ? <ChevronUpDoubleIcon aria-hidden /> : <ChevronDownDoubleIcon aria-hidden />}
          onClick={toggleExpandAll}
        />
        <GridSearch
          gridArea={GridArea.TITLE}
          label="Tittel/journalpost-ID"
          hideLabel
          size="small"
          variant="simple"
          placeholder="Tittel/journalpost-ID"
          onChange={setSearch}
          value={search}
        />

        <FilterDropdown
          options={temaOptions}
          onChange={setSelectedTemaer}
          selected={selectedTemaer}
          style={{ gridArea: GridArea.TEMA }}
        >
          Tema
        </FilterDropdown>

        <DateFilter onChange={setSelectedDateRange} selected={selectedDateRange}>
          Dato
        </DateFilter>

        <FilterDropdown
          options={avsenderMottakerOptions}
          onChange={setSelectedAvsenderMottakere}
          selected={selectedAvsenderMottakere}
          align="left"
          style={{ gridArea: GridArea.AVSENDER_MOTTAKER }}
          title="Avsender/mottaker/notatfører"
        >
          Avs./mot./not.
        </FilterDropdown>

        <FilterDropdown
          options={saksIdOptions}
          onChange={setSelectedSaksIds}
          selected={selectedSaksIds}
          align="left"
          style={{ gridArea: GridArea.SAKS_ID }}
        >
          Saks-ID
        </FilterDropdown>

        <FilterDropdown
          options={fagsystemOptions}
          onChange={setSelectedFagsystemIds}
          selected={selectedFagsystemIds}
          align="left"
          style={{ gridArea: GridArea.FAGSYSTEM }}
        >
          Fagsystem
        </FilterDropdown>

        <FilterDropdown
          options={JOURNALPOSTTYPE_OPTIONS}
          onChange={setSelectedTypes}
          selected={selectedTypes}
          align="left"
          style={{ gridArea: GridArea.TYPE }}
        >
          Type
        </FilterDropdown>
      </StyledGrid>
    </>
  );
};
