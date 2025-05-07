import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetArkivertDokumentQuery } from '@app/redux/api/journalposter';
import { SaksTypeEnum } from '@app/types/common';
import { skipToken } from '@reduxjs/toolkit/query/react';

export const useJournalpost = () => {
  const { journalpostId } = useRegistrering();
  const { data, ...rest } = useGetArkivertDokumentQuery(journalpostId ?? skipToken);

  return { journalpost: data, ...rest };
};

export const useJournalpostFromMulighet = () => {
  const { mulighet, typeId, mulighetIsBasedOnJournalpost } = useRegistrering();
  const isOmgjøringskravBasedOnJournalpost = typeId === SaksTypeEnum.OMGJØRINGSKRAV && mulighetIsBasedOnJournalpost;

  const { data, ...rest } = useGetArkivertDokumentQuery(
    isOmgjøringskravBasedOnJournalpost && typeof mulighet?.id === 'string' ? mulighet.id : skipToken,
  );

  return { journalpost: data, ...rest };
};
