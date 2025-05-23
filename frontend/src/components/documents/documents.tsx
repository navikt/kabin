import { DocumentsBase } from '@app/components/documents/documents-base';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetArkiverteDokumenterQuery } from '@app/redux/api/journalposter';
import { useSetJournalpostIdMutation } from '@app/redux/api/registreringer/mutations';
import type { IArkivertDocument } from '@app/types/dokument';
import { skipToken } from '@reduxjs/toolkit/query/react';
import type { CanBeSelected } from './document/types';

export const Dokumenter = () => {
  const { sakenGjelderValue, journalpostId, mulighet } = useRegistrering();
  const { data, isLoading, isFetching, refetch } = useGetArkiverteDokumenterQuery(sakenGjelderValue ?? skipToken);
  const { id } = useRegistrering();
  const [setJournalpostId, { isLoading: selectIsLoading }] = useSetJournalpostIdMutation();

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

  return (
    <DocumentsBase
      dokumenter={data?.dokumenter.filter((d) => d.journalpostId !== mulighet?.id)}
      isLoading={isLoading || isFetching}
      refetch={refetch}
      selectJournalpost={[createOnMouseDown, selectIsLoading]}
      getIsSelected={(id) => journalpostId === id}
      getCanBeSelected={getCanBeSelected}
      heading="Velg journalpost"
    />
  );
};
