import type { CanBeSelected } from '@app/components/documents/journalpost/document/types';
import { JournalpostList } from '@app/components/documents/journalpost/journalpost-list';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetArkiverteDokumenterQuery } from '@app/redux/api/journalposter';
import { useSetMulighetBasedOnJournalpostMutation } from '@app/redux/api/registreringer/mutations';
import { SaksTypeEnum } from '@app/types/common';
import type { IArkivertDocument } from '@app/types/dokument';
import { FAGSYSTEM_ARBEIDSOPPFØLGING, FAGSYSTEM_ARENA, FAGSYSTEM_GOSYS } from '@app/types/fagsystem';
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

    const { fagsystemId } = document.sak;

    if (typeId === SaksTypeEnum.ANKE) {
      return fagsystemId === FAGSYSTEM_ARENA
        ? [true, undefined]
        : [false, 'Opprettelse av anke basert på journalpost er bare tilgjengelig for saker fra Arena.'];
    }

    if (typeId === SaksTypeEnum.KLAGE) {
      // Treat fagsystemer Arbeidsoppfølging and Gosys as Arena: https://nav-it.slack.com/archives/G01CTUC8LSU/p1787141984237739 / https://nav-it.slack.com/archives/G01CTUC8LSU/p1788425945624739
      return fagsystemId === FAGSYSTEM_ARBEIDSOPPFØLGING ||
        fagsystemId === FAGSYSTEM_ARENA ||
        fagsystemId === FAGSYSTEM_GOSYS
        ? [true, undefined]
        : [false, 'Opprettelse av klage basert på journalpost er bare tilgjengelig for saker fra Arena.'];
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
