import { ChevronUpIcon, FolderFileIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading, Loader } from '@navikt/ds-react';
import React, { useContext, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import styled from 'styled-components';
import { CardMedium } from '@app/components/card/card';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { SelectedDocument } from '@app/components/selected/selected-document';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { DocumentViewerContext } from '@app/pages/create/document-viewer-context';
import { useDokumenter } from '@app/simple-api-state/use-api';
import { IArkivertDocument } from '@app/types/dokument';
import { ValidationFieldNames } from '@app/types/validation';
import { ColumnHeaders } from './column-headers';
import { Dokument } from './document/document';
import { useFilteredDocuments } from './filter-helpers';

export const Dokumenter = () => {
  const { type, fnr, journalpost, setJournalpost } = useContext(ApiContext);
  const { data: dokumenter, isLoading } = useDokumenter(fnr);
  const { viewDokument } = useContext(DocumentViewerContext);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const error = useValidationError(ValidationFieldNames.JOURNALPOST_ID);

  useEffect(() => {
    if (typeof dokumenter === 'undefined') {
      setIsExpanded(true);
      viewDokument(null);

      if (type !== Type.NONE && journalpost !== null) {
        setJournalpost(null);
      }
    }
  }, [dokumenter, journalpost, setJournalpost, type, viewDokument]);

  if (!isExpanded && journalpost !== null) {
    return <SelectedDocument onClick={() => setIsExpanded(true)} />;
  }

  return (
    <CardMedium>
      <Header>
        <Heading size="small" level="1">
          Velg journalpost
        </Heading>

        {journalpost === null ? null : (
          <StyledButton
            size="small"
            variant="tertiary-neutral"
            onClick={() => setIsExpanded(false)}
            icon={<ChevronUpIcon aria-hidden />}
            title="Vis kun valgt journalpost"
          />
        )}
      </Header>

      <ValidationErrorMessage error={error} id={ValidationFieldNames.JOURNALPOST_ID} />

      <Content dokumenter={dokumenter?.dokumenter} isLoading={isLoading} />
    </CardMedium>
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
    return <BodyShort>Ingen journalposter</BodyShort>;
  }

  return <DocumentTable dokumenter={dokumenter} />;
};

const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
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
  min-height: 32px;
`;
