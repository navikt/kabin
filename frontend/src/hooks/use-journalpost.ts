import { skipToken } from '@reduxjs/toolkit/query/react';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetArkivertDokumentQuery } from '@app/redux/api/journalposter';

export const useJournalpost = () => {
  const { journalpostId } = useRegistrering();
  const { data, ...rest } = useGetArkivertDokumentQuery(journalpostId ?? skipToken);

  return { journalpost: data, ...rest };
};

// export const useJournalpost = () => {
//   const { journalpostId } = useRegistrering();
//   const { journalpost, ...rest } = useGetArkiverteDokumenterQuery(journalpostId ?? skipToken, {
//     selectFromResult: ({ data }) => ({ journalpost: data?.dokumenter.find((d) => d.journalpostId === journalpostId) }),
//   });

//   return { journalpost, ...rest };
// };
