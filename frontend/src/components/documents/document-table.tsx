import { ColumnHeaders } from '@app/components/documents/column-headers';
import { Dokument } from '@app/components/documents/document/document';
import { useFilteredDocuments } from '@app/components/documents/filter-helpers';
import type { DateRange } from '@app/types/common';
import type { IArkivertDocument } from '@app/types/dokument';
import { useState } from 'react';
import { styled } from 'styled-components';

interface Props {
  dokumenter: IArkivertDocument[];
}

export const DocumentTable = ({ dokumenter }: Props) => {
  const [search, setSearch] = useState<string>('');
  const [selectedTemaer, setSelectedTemaer] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAvsenderMottakere, setSelectedAvsenderMottakere] = useState<string[]>([]);
  const [selectedSaksIds, setSelectedSaksIds] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(undefined);

  const filteredDokumenter = useFilteredDocuments(
    dokumenter,
    selectedAvsenderMottakere,
    selectedDateRange,
    selectedSaksIds,
    selectedTemaer,
    selectedTypes,
    search,
  );

  return (
    <>
      <ColumnHeaders
        search={search}
        setSearch={setSearch}
        selectedTemaer={selectedTemaer}
        setSelectedTemaer={setSelectedTemaer}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        selectedAvsenderMottakere={selectedAvsenderMottakere}
        setSelectedAvsenderMottakere={setSelectedAvsenderMottakere}
        selectedSaksIds={selectedSaksIds}
        setSelectedSaksIds={setSelectedSaksIds}
        selectedDateRange={selectedDateRange}
        setSelectedDateRange={setSelectedDateRange}
        documents={dokumenter}
      />
      <StyledList>
        {filteredDokumenter.map((d) => (
          <Dokument key={`${d.journalpostId}-${d.dokumentInfoId}`} dokument={d} />
        ))}
      </StyledList>
    </>
  );
};

const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
`;
