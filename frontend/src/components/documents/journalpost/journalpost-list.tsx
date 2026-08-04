import { CardMedium } from '@app/components/card/card';
import { DocumentTable } from '@app/components/documents/journalpost/document-table';
import { LoadingDocuments } from '@app/components/documents/journalpost/loading-documents';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { SelectedDocument } from '@app/components/selected/selected-document';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import type { IArkivertDocument } from '@app/types/dokument';
import { ValidationFieldNames } from '@app/types/validation';
import { ChevronUpIcon, FolderFileIcon } from '@navikt/aksel-icons';
import { BodyShort, Button } from '@navikt/ds-react';
import { useState } from 'react';
import type { BaseSelectDocumentProps } from './document/types';

interface Props extends BaseSelectDocumentProps {
  dokumenter: IArkivertDocument[] | undefined;
  isLoading: boolean;
  refetch: () => void;
}

export const JournalpostList = ({
  dokumenter,
  isLoading,
  refetch,
  selectJournalpost,
  getIsSelected,
  getCanBeSelected,
}: Props) => {
  const { sakenGjelderValue, journalpostId } = useRegistrering();
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
    <CardMedium id="documents" ariaLabel="Velg journalpost">
      {journalpostId === null ? null : (
        <div className="flex justify-end">
          <Button
            size="xsmall"
            variant="tertiary-neutral"
            onClick={() => setIsExpanded(false)}
            icon={<ChevronUpIcon aria-hidden />}
            title="Vis kun valgt journalpost"
          />
        </div>
      )}
      <ValidationErrorMessage error={error} id={ValidationFieldNames.JOURNALPOST_ID} />
      <Content
        dokumenter={dokumenter}
        isLoading={isLoading}
        refetch={refetch}
        canRefetch={sakenGjelderValue !== null}
        selectJournalpost={selectJournalpost}
        getIsSelected={getIsSelected}
        getCanBeSelected={getCanBeSelected}
      />
    </CardMedium>
  );
};

interface ContentProps extends BaseSelectDocumentProps {
  dokumenter: IArkivertDocument[] | undefined;
  isLoading: boolean;
  refetch: () => void;
  canRefetch: boolean;
}

const Content = ({
  dokumenter,
  isLoading,
  refetch,
  canRefetch,
  selectJournalpost,
  getIsSelected,
  getCanBeSelected,
}: ContentProps) => {
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

  return (
    <DocumentTable
      dokumenter={dokumenter}
      isLoading={isLoading}
      refetch={refetch}
      canRefetch={canRefetch}
      selectJournalpost={selectJournalpost}
      getIsSelected={getIsSelected}
      getCanBeSelected={getCanBeSelected}
    />
  );
};
