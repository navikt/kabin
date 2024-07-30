import { ArrowsCirclepathIcon, ChevronUpIcon, FolderFileIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useContext, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { CardMedium } from '@app/components/card/card';
import { DocumentTable } from '@app/components/documents/document-table';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { SelectedDocument } from '@app/components/selected/selected-document';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { DocumentViewerContext } from '@app/pages/create/document-viewer-context';
import { useGetArkiverteDokumenterQuery } from '@app/redux/api/journalposter';
import { useSetJournalpostIdMutation } from '@app/redux/api/registrering';
import { IArkivertDocument } from '@app/types/dokument';
import { ValidationFieldNames } from '@app/types/validation';

export const Dokumenter = () => {
  const registrering = useRegistrering();
  const {
    data: dokumenter,
    isLoading,
    isFetching,
    refetch,
  } = useGetArkiverteDokumenterQuery(registrering?.sakenGjelderValue ?? skipToken);
  const [setJournalpost] = useSetJournalpostIdMutation();
  const { dokument, viewDokument } = useContext(DocumentViewerContext);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const error = useValidationError(ValidationFieldNames.JOURNALPOST_ID);

  useEffect(() => {
    if (dokumenter === undefined) {
      setIsExpanded(true);
      viewDokument(null);

      if (registrering !== undefined && registrering.typeId !== null && registrering.journalpostId !== null) {
        setJournalpost({ id: registrering.id, journalpostId: null });
      }
    }
  }, [dokumenter, registrering, registrering.id, setJournalpost, viewDokument]);

  if (registrering === undefined) {
    return null;
  }

  const { journalpostId } = registrering;

  if (!isExpanded && journalpostId !== null) {
    return <SelectedDocument onClick={() => setIsExpanded(true)} />;
  }

  // const onRefresh = async () => {
  // const updated = await refetch();

  // if (updated === undefined) {
  //   return;
  // }

  // const hadDokument = dokument !== null;
  // const hadJournalpost = journalpostId !== null;

  // if (!hadDokument && !hadJournalpost) {
  //   return;
  // }

  // let newDokument: IArkivertDocument | null = null;
  // let newJournalpost: IArkivertDocument | null = null;

  // for (const d of updated.dokumenter) {
  //   if (hadDokument && newDokument === null && d.dokumentInfoId === dokument.dokumentInfoId) {
  //     // If the viewed document is in the list of documents, update it.
  //     newDokument = d;
  //   }

  //   if (hadJournalpost && newJournalpost === null && d.dokumentInfoId === journalpost.dokumentInfoId) {
  //     // If the selected journalpost is in the list of documents, update it.
  //     newJournalpost = d;
  //   }

  //   if ((!hadDokument || newDokument !== null) && (!hadJournalpost || newJournalpost !== null)) {
  //     // If both the viewed document and the selected journalpost are found, stop searching.
  //     break;
  //   }
  // }

  // viewDokument(newDokument);
  // setJournalpost(newJournalpost);
  // };

  return (
    <CardMedium labelledBy="documents-heading">
      <Header>
        <Heading size="small" level="1" id="documents-heading">
          Velg journalpost
        </Heading>

        <Button
          size="xsmall"
          variant="tertiary"
          onClick={() => refetch()}
          loading={isLoading || isFetching}
          icon={<ArrowsCirclepathIcon aria-hidden />}
          title="Oppdater"
        />

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
