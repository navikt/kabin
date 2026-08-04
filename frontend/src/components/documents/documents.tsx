import type { CanBeSelected } from '@app/components/documents/journalpost/document/types';
import { JournalpostList } from '@app/components/documents/journalpost/journalpost-list';
import { UploadDokumenter } from '@app/components/documents/upload/upload-dokumenter';
import { ToggleItem } from '@app/components/toggle-item/toggle-item';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetArkiverteDokumenterQuery } from '@app/redux/api/journalposter';
import { useSetJournalpostIdMutation, useSetSourceMutation } from '@app/redux/api/registreringer/mutations';
import { Source } from '@app/redux/api/registreringer/types';
import type { IArkivertDocument } from '@app/types/dokument';
import { CloudUpIcon, FingerButtonIcon, InboxDownIcon } from '@navikt/aksel-icons';
import { HStack, ToggleGroup, Tooltip, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';

const isSource = (value: string): value is Source =>
  value === Source.JOURNALPOST || value === Source.UPLOADED_DOCUMENTS || value === Source.ANKE;

export const Dokumenter = () => {
  const { id, sakenGjelderValue, journalpostId, mulighet, source } = useRegistrering();
  const canEdit = useCanEdit();
  const { data, isLoading, isFetching, refetch } = useGetArkiverteDokumenterQuery(sakenGjelderValue ?? skipToken);
  const [setJournalpostId, { isLoading: selectIsLoading }] = useSetJournalpostIdMutation();
  const [setSource] = useSetSourceMutation();

  const createOnMouseDown = (journalpostId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();

    if (e.button !== 0) {
      return;
    }

    setJournalpostId({ id, journalpostId });
  };

  const getCanBeSelected = (document: IArkivertDocument): CanBeSelected => {
    if (!document.harTilgangTilArkivvariant) {
      return [false, 'Du har ikke tilgang til dette dokumentet'];
    }

    return [true, undefined];
  };

  const onChange = (value: string) => {
    if (!canEdit || !isSource(value)) {
      return;
    }

    setSource({ id, source: value });
  };

  return (
    <VStack gap="space-16">
      <HStack justify="center">
        <ToggleGroup onChange={onChange} value={source} size="small">
          <ToggleItem
            value={Source.JOURNALPOST}
            icon={<FingerButtonIcon aria-hidden />}
            label="Velg journalpost"
            disabled={!canEdit}
          />
          <ToggleItem
            value={Source.UPLOADED_DOCUMENTS}
            icon={<CloudUpIcon aria-hidden />}
            label="Last opp"
            disabled={!canEdit}
          />
          {/* Disabled until Anke fra TR is implemented in Kabin API, Kabel, Kaptein and Kaka */}
          <Tooltip content="Kommer 01.01.2027">
            <span>
              <ToggleItem
                value={Source.ANKE}
                icon={<InboxDownIcon aria-hidden />}
                label="Anke fra Trygderetten"
                disabled
              />
            </span>
          </Tooltip>
        </ToggleGroup>
      </HStack>

      {source === Source.JOURNALPOST ? (
        <JournalpostList
          dokumenter={data?.dokumenter.filter((d) => d.journalpostId !== mulighet?.id)}
          isLoading={isLoading || isFetching}
          refetch={refetch}
          selectJournalpost={[createOnMouseDown, selectIsLoading]}
          getIsSelected={(id) => journalpostId === id}
          getCanBeSelected={getCanBeSelected}
        />
      ) : (
        <UploadDokumenter />
      )}
    </VStack>
  );
};
