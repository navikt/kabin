import { Collapse } from '@navikt/ds-icons';
import { BodyShort, Button, Heading } from '@navikt/ds-react';
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import styled from 'styled-components';
import { IArkivertDocument } from '../../types/dokument';
import { Card } from '../card/card';
import { SelectedDocument } from '../selected/selected-document';
import { ColumnHeaders } from './column-headers';
import { Dokument } from './document';
import { useFilteredDocuments } from './filter-helpers';

interface Props {
  dokumenter: IArkivertDocument[];
}

export const Dokumenter = ({ dokumenter }: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
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
    search
  );

  if (!isExpanded) {
    return <SelectedDocument onClick={() => setIsExpanded(true)} />;
  }

  const children =
    filteredDokumenter.length === 0 ? (
      <BodyShort>Ingen dokumenter</BodyShort>
    ) : (
      filteredDokumenter.map((d) => <Dokument key={`${d.journalpostId}-${d.dokumentInfoId}`} dokument={d} />)
    );

  return (
    <Card>
      <Header>
        <Heading size="small" level="1">
          Dokumenter
        </Heading>
        <StyledButton
          size="small"
          variant="tertiary-neutral"
          onClick={() => setIsExpanded(false)}
          icon={<Collapse aria-hidden />}
          title="Vis kun valgt journalpost"
        />
      </Header>
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
      <StyledList>{children}</StyledList>
    </Card>
  );
};

const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
  max-height: 350px;
`;

const StyledButton = styled(Button)`
  justify-self: flex-end;
  flex-grow: 0;
  width: fit-content;
  align-self: flex-end;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;
