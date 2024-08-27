import { createApi } from '@reduxjs/toolkit/query/react';
import { KABIN_API_BASE_QUERY } from '@app/redux/api/common';
import { IArkivertDocument } from '@app/types/dokument';

interface JournalpostId {
  journalpostId: string;
  dokumentInfoId: string;
}

interface SetDokumenttittelParams extends JournalpostId {
  sakenGjelderValue: string | null;
  tittel: string;
}

export const arkiverteDokumenterApi = createApi({
  reducerPath: 'arkiverteDokumenterApi',
  baseQuery: KABIN_API_BASE_QUERY,
  keepUnusedDataFor: 60 * 60 * 1, // 1 hour
  endpoints: (builder) => ({
    getArkiverteDokumenter: builder.query<{ dokumenter: IArkivertDocument[] }, string>({
      query: (idnummer) => ({
        url: '/arkivertedokumenter',
        method: 'POST',
        body: { idnummer },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        for (const dokument of data.dokumenter) {
          dispatch(
            arkiverteDokumenterApi.util.upsertQueryData('getArkivertDokument', dokument.journalpostId, dokument),
          );
        }
      },
    }),

    getArkivertDokument: builder.query<IArkivertDocument, string>({
      keepUnusedDataFor: Infinity,
      query: (id) => `/arkivertedokumenter/${id}`,
    }),

    setArkivertDokumentTitle: builder.mutation<{ tittel: string }, SetDokumenttittelParams>({
      query: ({ journalpostId, dokumentInfoId, tittel }) => ({
        url: `/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/tittel`,
        method: 'PUT',
        body: { tittel },
      }),
      onQueryStarted: async (
        { sakenGjelderValue, journalpostId, dokumentInfoId, tittel },
        { dispatch, queryFulfilled },
      ) => {
        if (sakenGjelderValue === null) {
          return;
        }

        const singlePatchResult = dispatch(
          arkiverteDokumenterApi.util.updateQueryData('getArkivertDokument', journalpostId, (draft) => {
            draft.tittel = tittel;
          }),
        );

        const patchResult = dispatch(
          arkiverteDokumenterApi.util.updateQueryData('getArkiverteDokumenter', sakenGjelderValue, (draft) => {
            for (const dokument of draft.dokumenter) {
              if (dokument.dokumentInfoId === dokumentInfoId) {
                dokument.tittel = tittel;
              } else {
                // A document cannot be an attachment to itself.
                for (const vedlegg of dokument.vedlegg) {
                  if (vedlegg.dokumentInfoId === dokumentInfoId) {
                    vedlegg.tittel = tittel;
                  }
                }
              }
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          singlePatchResult.undo();
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetArkiverteDokumenterQuery, useGetArkivertDokumentQuery, useSetArkivertDokumentTitleMutation } =
  arkiverteDokumenterApi;
