import { ArrowsCirclepathIcon, ChevronUpIcon, FolderFileIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useState } from 'react';
import { styled } from 'styled-components';
import { CardMedium } from '@app/components/card/card';
import { DocumentTable } from '@app/components/documents/document-table';
import { LoadingDocuments } from '@app/components/documents/loading-documents';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { SelectedDocument } from '@app/components/selected/selected-document';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useGetArkiverteDokumenterQuery } from '@app/redux/api/journalposter';
import { IArkivertDocument } from '@app/types/dokument';
import { ValidationFieldNames } from '@app/types/validation';

export const Dokumenter = () => {
  const { sakenGjelderValue, journalpostId } = useRegistrering();
  const {
    data: dokumenter,
    isLoading,
    isFetching,
    refetch,
  } = useGetArkiverteDokumenterQuery(sakenGjelderValue ?? skipToken);
  const canEdit = useCanEdit();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const error = useValidationError(ValidationFieldNames.JOURNALPOST_ID);

  if (journalpostId === null && !isExpanded) {
    setIsExpanded(true);
  }

  if (!canEdit) {
    return <SelectedDocument />;
  }

  if (!isExpanded && journalpostId !== null) {
    return <SelectedDocument onClick={() => setIsExpanded(true)} />;
  }

  return (
    <CardMedium labelledBy="documents-heading" id="documents">
      <Header>
        <Heading size="small" level="1" id="documents-heading">
          Velg journalpost
        </Heading>

        {sakenGjelderValue === null ? null : (
          <Button
            size="xsmall"
            variant="tertiary"
            onClick={() => refetch()}
            loading={isLoading || isFetching}
            icon={<ArrowsCirclepathIcon aria-hidden />}
            title="Oppdater"
          />
        )}

        {journalpostId === null ? null : (
          <StyledButton
            size="xsmall"
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

interface ContentProps {
  dokumenter: IArkivertDocument[] | undefined;
  isLoading: boolean;
}

const Content = ({ dokumenter, isLoading }: ContentProps) => {
  if (isLoading) {
    return <LoadingDocuments />;
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

const StyledButton = styled(Button)`
  flex-grow: 0;
  width: fit-content;
  align-self: flex-end;
  justify-self: right;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: min-content min-content 1fr;
  grid-gap: 4px;
  white-space: nowrap;
`;
