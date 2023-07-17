import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { styled } from 'styled-components';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { useTema } from '@app/simple-api-state/use-kodeverk';
import { IArkivertDocument, JournalposttypeEnum } from '@app/types/dokument';
import { DateFilter } from './date-filter';
import { getSaksIdOptions, useAvsenderMottakerNoteurOptions } from './filter-helpers';
import { GridArea, GridSearch, StyledGrid } from './styled-grid-components';

const EMPTY_LIST: [] = [];

const JOURNALPOSTTYPE_OPTIONS = [
  { label: 'Inngående', value: JournalposttypeEnum.INNGAAENDE },
  { label: 'Utgående', value: JournalposttypeEnum.UTGAAENDE },
  { label: 'Notat', value: JournalposttypeEnum.NOTAT },
];

interface Props {
  documents: IArkivertDocument[];
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
  selectedDateRange: DateRange | undefined;
  setSelectedDateRange: (range: DateRange | undefined) => void;
}

export const ColumnHeaders = ({
  documents,
  search,
  setSearch,
  selectedAvsenderMottakere,
  selectedDateRange,
  selectedSaksIds,
  selectedTemaer,
  selectedTypes,
  setSelectedAvsenderMottakere,
  setSelectedDateRange,
  setSelectedSaksIds,
  setSelectedTemaer,
  setSelectedTypes,
}: Props) => {
  const { data: allTemaer } = useTema();

  const temaOptions = useMemo(
    () => (allTemaer === undefined ? EMPTY_LIST : allTemaer.map((t) => ({ value: t.id, label: t.beskrivelse }))),
    [allTemaer],
  );

  const avsenderMottakerOptions = useAvsenderMottakerNoteurOptions(documents);
  const saksIdOptions = useMemo(() => getSaksIdOptions(documents), [documents]);

  const resetFilters = () => {
    setSelectedTemaer([]);
    setSelectedTypes([]);
    setSelectedAvsenderMottakere([]);
    setSelectedSaksIds([]);
    setSelectedDateRange(undefined);
  };

  const resetFiltersDisabled = useMemo(
    () =>
      selectedTemaer.length === 0 &&
      selectedTypes.length === 0 &&
      selectedAvsenderMottakere.length === 0 &&
      selectedSaksIds.length === 0 &&
      selectedDateRange === undefined,
    [
      selectedAvsenderMottakere.length,
      selectedDateRange,
      selectedSaksIds.length,
      selectedTemaer.length,
      selectedTypes.length,
    ],
  );

  return (
    <>
      <StyledButton
        size="small"
        variant="secondary"
        onClick={resetFilters}
        disabled={resetFiltersDisabled}
        icon={<ArrowCirclepathIcon aria-hidden />}
      >
        Fjern filtere
      </StyledButton>
      <StyledGrid as="section">
        <GridSearch
          $gridArea={GridArea.TITLE}
          label="Tittel/journalpost-ID"
          hideLabel
          size="small"
          variant="simple"
          placeholder="Tittel/journalpost-ID"
          onChange={setSearch}
          value={search}
        />

        <StyledFilterDropdown
          options={temaOptions}
          onChange={setSelectedTemaer}
          selected={selectedTemaer}
          $area={GridArea.TEMA}
        >
          Tema
        </StyledFilterDropdown>

        <DateFilter onChange={setSelectedDateRange} selected={selectedDateRange}>
          Dato
        </DateFilter>

        <StyledFilterDropdown
          options={avsenderMottakerOptions}
          onChange={setSelectedAvsenderMottakere}
          selected={selectedAvsenderMottakere}
          align="left"
          $area={GridArea.AVSENDER_MOTTAKER}
          title="Avsender/mottaker/notatfører"
        >
          Avs./mot./not.
        </StyledFilterDropdown>

        <StyledFilterDropdown
          options={saksIdOptions}
          onChange={setSelectedSaksIds}
          selected={selectedSaksIds}
          align="left"
          $area={GridArea.SAKS_ID}
        >
          Saks-ID
        </StyledFilterDropdown>

        <StyledFilterDropdown
          options={JOURNALPOSTTYPE_OPTIONS}
          onChange={setSelectedTypes}
          selected={selectedTypes}
          align="left"
          $area={GridArea.TYPE}
        >
          Type
        </StyledFilterDropdown>
      </StyledGrid>
    </>
  );
};

const StyledButton = styled(Button)`
  width: 200px;
`;

const StyledFilterDropdown = styled(FilterDropdown)<{ $area: GridArea }>`
  grid-area: ${({ $area }) => $area};
`;
