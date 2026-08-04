import type { CanBeSelected } from '@app/components/documents/journalpost/document/types';
import { JournalpostList } from '@app/components/documents/journalpost/journalpost-list';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetArkiverteDokumenterQuery } from '@app/redux/api/journalposter';
import { useSetMulighetBasedOnJournalpostMutation } from '@app/redux/api/registreringer/mutations';
import { SaksTypeEnum } from '@app/types/common';
import type { IArkivertDocument } from '@app/types/dokument';
import { FAGSYSTEM_ARENA } from '@app/types/fagsystem';
import { skipToken } from '@reduxjs/toolkit/query';

export const Journalpostmuligheter = () => {
  const { sakenGjelderValue, mulighet, journalpostId, typeId } = useRegistrering();
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
      return [false, 'Du har ikke tilgang til dette dokumentet.'];
    }

    if (typeof document.sak?.fagsakId !== 'string') {
      return [false, 'Ingen fagsak tilknyttet.'];
    }

    if (
      (typeId === SaksTypeEnum.KLAGE || typeId === SaksTypeEnum.ANKE) &&
      document.sak.fagsystemId !== FAGSYSTEM_ARENA
    ) {
      return [false, 'Opprettelse av klage eller anke basert på journalpost er bare tilgjengelig for saker fra Arena.'];
    }

    return [true, undefined];
  };

  return (
    <JournalpostList
      dokumenter={data?.dokumenter.filter((d) => d.journalpostId !== journalpostId)}
      isLoading={isLoading || isFetching}
      refetch={refetch}
      selectJournalpost={[createOnMouseDown, selectIsLoading]}
      getIsSelected={(id) => mulighet?.id === id}
      getCanBeSelected={getCanBeSelected}
    />
  );
};
