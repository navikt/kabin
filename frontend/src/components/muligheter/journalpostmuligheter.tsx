import type { CanBeSelected } from '@app/components/documents/document/types';
import { DocumentsBase } from '@app/components/documents/documents-base';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetArkiverteDokumenterQuery } from '@app/redux/api/journalposter';
import { useSetMulighetBasedOnJournalpostMutation } from '@app/redux/api/registreringer/mutations';
import type { IArkivertDocument } from '@app/types/dokument';
import { skipToken } from '@reduxjs/toolkit/query';

interface Props {
  title: string;
}

export const Journalpostmuligheter = ({ title }: Props) => {
  const { sakenGjelderValue, mulighet, journalpostId } = useRegistrering();
  const { data, isLoading, isFetching, refetch } = useGetArkiverteDokumenterQuery(sakenGjelderValue ?? skipToken);
  const { id } = useRegistrering();
  const [setJournalpostId, { isLoading: selectIsLoading }] = useSetMulighetBasedOnJournalpostMutation();

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

    if (typeof document.sak?.fagsakId !== 'string') {
      return [false, 'Ingen fagsak tilknyttet'];
    }

    return [true, undefined];
  };

  return (
    <DocumentsBase
      dokumenter={data?.dokumenter.filter((d) => d.journalpostId !== journalpostId)}
      isLoading={isLoading || isFetching}
      refetch={refetch}
      selectJournalpost={[createOnMouseDown, selectIsLoading]}
      getIsSelected={(id) => mulighet?.id === id}
      getCanBeSelected={getCanBeSelected}
      heading={title}
    />
  );
};
