import type { CanBeSelected } from '@app/components/documents/journalpost/document/types';
import { JournalpostList } from '@app/components/documents/journalpost/journalpost-list';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetArkiverteDokumenterQuery } from '@app/redux/api/journalposter';
import { useSetMulighetBasedOnJournalpostMutation } from '@app/redux/api/registreringer/mutations';
import { SaksTypeEnum } from '@app/types/common';
import type { IArkivertDocument } from '@app/types/dokument';
import { FAGSYSTEM_ARBEIDSOPPFØLGING, FAGSYSTEM_ARENA, FAGSYSTEM_GOSYS, FAGSYSTEM_PESYS } from '@app/types/fagsystem';
import { TEMA_ALDERSPENSJON, TEMA_UFØRETRYGD } from '@app/types/tema';
import { skipToken } from '@reduxjs/toolkit/query';
import type { JSX } from 'react';

interface Props {
  heading?: JSX.Element;
}

export const Journalpostmuligheter = ({ heading }: Props) => {
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

    if (typeof document.sak?.saksnummer !== 'string') {
      return [false, 'Ingen fagsak tilknyttet.'];
    }

    const isKlage = typeId === SaksTypeEnum.KLAGE;
    const isAnke = typeId === SaksTypeEnum.ANKE || typeId === SaksTypeEnum.ANKE_AFTER_2027;

    if (!isKlage && !isAnke) {
      return [true, undefined];
    }

    const {
      sak: { fagsystemId },
      temaId,
    } = document;

    if (fagsystemId === FAGSYSTEM_PESYS) {
      return temaId === TEMA_UFØRETRYGD || temaId === TEMA_ALDERSPENSJON
        ? [true, undefined]
        : [false, INVALID_PESYS_TEMA_MESSAGE];
    }

    const isAllowedFagsystem =
      fagsystemId === FAGSYSTEM_ARENA ||
      (isKlage && (fagsystemId === FAGSYSTEM_ARBEIDSOPPFØLGING || fagsystemId === FAGSYSTEM_GOSYS));

    return isAllowedFagsystem ? [true, undefined] : [false, INVALID_ARENA_MESSAGE];
  };

  return (
    <JournalpostList
      dokumenter={data?.dokumenter.filter((d) => d.journalpostId !== journalpostId)}
      isLoading={isLoading || isFetching}
      refetch={refetch}
      selectJournalpost={[createOnMouseDown, selectIsLoading]}
      getIsSelected={(id) => mulighet?.id === id}
      getCanBeSelected={getCanBeSelected}
      heading={heading}
    />
  );
};

const INVALID_PESYS_TEMA_MESSAGE =
  'Opprettelse av anke basert på journalpost med fagsystem Pesys er bare tilgjengelig for journalposter med tema Uføretrygd eller Alderspensjon.';
const INVALID_ARENA_MESSAGE = 'Opprettelse av anke basert på journalpost er bare tilgjengelig for saker fra Arena.';
