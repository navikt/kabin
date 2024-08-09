import { skipToken } from '@reduxjs/toolkit/query/react';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetArkivertDokumentQuery } from '@app/redux/api/journalposter';

export const useJournalpost = () => {
  const { journalpostId } = useRegistrering();
  const { data, ...rest } = useGetArkivertDokumentQuery(journalpostId ?? skipToken);

  return { journalpost: data, ...rest };
};
