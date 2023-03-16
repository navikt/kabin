import { ChevronUpIcon, FolderFileIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading, Loader } from '@navikt/ds-react';
import React, { useContext, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import styled from 'styled-components';
import { AnkeContext } from '../../pages/create/anke-context';
import { DocumentViewerContext } from '../../pages/create/document-viewer-context';
import { useDokumenter } from '../../simple-api-state/use-api';
import { IArkivertDocument } from '../../types/dokument';
import { Card } from '../card/card';
import { Placeholder } from '../placeholder/placeholder';
import { SelectedDocument } from '../selected/selected-document';
import { ColumnHeaders } from './column-headers';
import { Dokument } from './document';
import { useFilteredDocuments } from './filter-helpers';

export const Dokumenter = () => {
  const { setDokument, fnr, dokument } = useContext(AnkeContext);
  const { data: dokumenter, isLoading } = useDokumenter(fnr);
  const { viewDokument } = useContext(DocumentViewerContext);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  useEffect(() => {
    if (typeof dokumenter === 'undefined') {
      setIsExpanded(true);
      viewDokument(null);
      setDokument(null);
    }
  }, [dokumenter, setDokument, viewDokument]);

  if (!isExpanded && dokument !== null) {
    return <SelectedDocument onClick={() => setIsExpanded(true)} />;
  }

  return (
    <Card>
      <Header>
        <Heading size="small" level="1">
          Velg anke
        </Heading>
        {dokument === null ? null : (
          <StyledButton
            size="small"
            variant="tertiary-neutral"
            onClick={() => setIsExpanded(false)}
            icon={<ChevronUpIcon aria-hidden />}
            title="Vis kun valgt journalpost"
          />
        )}
      </Header>
      <Content dokumenter={dokumenter?.dokumenter} isLoading={isLoading} />
    </Card>
  );
};

interface DocumentTableProps {
  dokumenter: IArkivertDocument[];
}

const DocumentTable = ({ dokumenter }: DocumentTableProps) => {
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

interface ContentProps {
  dokumenter: IArkivertDocument[] | undefined;
  isLoading: boolean;
}

const Content = ({ dokumenter, isLoading }: ContentProps) => {
  if (isLoading) {
    return (
      <Placeholder>
        <Loader size="3xlarge" title="Laster..." />
      </Placeholder>
    );
  }

  if (dokumenter === undefined) {
    return (
      <Placeholder>
        <FolderFileIcon aria-hidden />
      </Placeholder>
    );
  }

  if (dokumenter.length === 0) {
    <BodyShort>Ingen dokumenter</BodyShort>;
  }

  return <DocumentTable dokumenter={dokumenter} />;
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
