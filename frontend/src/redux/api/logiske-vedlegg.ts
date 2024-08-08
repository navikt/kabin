import { IS_LOCALHOST } from '@app/redux/api/common';
import { arkiverteDokumenterApi } from '@app/redux/api/journalposter';

interface AddLogiskVedleggParams {
  dokumentInfoId: string;
  tittel: string;
  sakenGjelderValue: string;
}

interface UpdateLogiskVedleggParams {
  dokumentInfoId: string;
  logiskVedleggId: string;
  tittel: string;
  sakenGjelderValue: string;
}

interface DeleteLogiskVedleggParams {
  dokumentInfoId: string;
  logiskVedleggId: string;
  sakenGjelderValue: string;
}

interface LogiskVedleggResponse {
  tittel: string;
  logiskVedleggId: string;
}

const logiskeVedleggSlice = arkiverteDokumenterApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    addLogiskVedlegg: builder.mutation<LogiskVedleggResponse, AddLogiskVedleggParams>({
      query: ({ dokumentInfoId, ...body }) => ({
        url: `/dokumenter/${dokumentInfoId}/logiskevedlegg`,
        method: 'POST',
        body,
      }),
      onQueryStarted: async ({ dokumentInfoId, tittel, sakenGjelderValue }, { dispatch, queryFulfilled }) => {
        const fakeId = crypto.randomUUID();

        const patchResult = dispatch(
          arkiverteDokumenterApi.util.updateQueryData('getArkiverteDokumenter', sakenGjelderValue, (draft) => {
            dokumentLoop: for (const dokument of draft.dokumenter) {
              if (dokument.dokumentInfoId === dokumentInfoId) {
                dokument.logiskeVedlegg.push({ logiskVedleggId: fakeId, tittel });
                continue dokumentLoop;
              }

              vedleggLoop: for (const vedlegg of dokument.vedlegg) {
                if (vedlegg.dokumentInfoId === dokumentInfoId) {
                  vedlegg.logiskeVedlegg.push({ logiskVedleggId: fakeId, tittel });
                  break vedleggLoop;
                }
              }
            }
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            arkiverteDokumenterApi.util.updateQueryData('getArkiverteDokumenter', sakenGjelderValue, (draft) => {
              dokumentLoop: for (const dokument of draft.dokumenter) {
                if (dokument.dokumentInfoId === dokumentInfoId) {
                  for (const vedlegg of dokument.logiskeVedlegg) {
                    if (vedlegg.logiskVedleggId === fakeId) {
                      vedlegg.logiskVedleggId = data.logiskVedleggId;
                      continue dokumentLoop;
                    }
                  }
                }

                vedleggLoop: for (const vedlegg of dokument.vedlegg) {
                  if (vedlegg.dokumentInfoId !== dokumentInfoId) {
                    continue vedleggLoop;
                  }

                  logiskLoop: for (const logiskVedlegg of vedlegg.logiskeVedlegg) {
                    if (logiskVedlegg.logiskVedleggId === fakeId) {
                      logiskVedlegg.logiskVedleggId = data.logiskVedleggId;
                      break logiskLoop;
                      break vedleggLoop;
                    }
                  }
                }
              }
            }),
          );
        } catch {
          patchResult.undo();
        }
      },
    }),

    updateLogiskVedlegg: builder.mutation<LogiskVedleggResponse, UpdateLogiskVedleggParams>({
      query: ({ logiskVedleggId, dokumentInfoId, ...body }) => ({
        url: `/dokumenter/${dokumentInfoId}/logiskevedlegg/${logiskVedleggId}`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async (
        { dokumentInfoId, logiskVedleggId, tittel, sakenGjelderValue },
        { dispatch, queryFulfilled },
      ) => {
        const patchResult = dispatch(
          arkiverteDokumenterApi.util.updateQueryData('getArkiverteDokumenter', sakenGjelderValue, (draft) => {
            dokumentLoop: for (const dokument of draft.dokumenter) {
              if (dokument.dokumentInfoId === dokumentInfoId) {
                for (const vedlegg of dokument.logiskeVedlegg) {
                  if (vedlegg.logiskVedleggId === logiskVedleggId) {
                    vedlegg.tittel = tittel;
                    continue dokumentLoop;
                  }
                }
              }

              vedleggLoop: for (const vedlegg of dokument.vedlegg) {
                if (vedlegg.dokumentInfoId !== dokumentInfoId) {
                  continue vedleggLoop;
                }

                logiskLoop: for (const logiskVedlegg of vedlegg.logiskeVedlegg) {
                  if (logiskVedlegg.logiskVedleggId === logiskVedleggId) {
                    logiskVedlegg.tittel = tittel;
                    break logiskLoop;
                    break vedleggLoop;
                  }
                }
              }
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    deleteLogiskVedlegg: builder.mutation<void, DeleteLogiskVedleggParams>({
      query: ({ dokumentInfoId, logiskVedleggId }) => ({
        url: `/dokumenter/${dokumentInfoId}/logiskevedlegg/${logiskVedleggId}`,
        method: 'DELETE',
      }),
      onQueryStarted: async ({ dokumentInfoId, logiskVedleggId, sakenGjelderValue }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          arkiverteDokumenterApi.util.updateQueryData('getArkiverteDokumenter', sakenGjelderValue, (draft) => {
            dokumentLoop: for (const dokument of draft.dokumenter) {
              if (dokument.dokumentInfoId === dokumentInfoId) {
                dokument.logiskeVedlegg = dokument.logiskeVedlegg.filter((v) => v.logiskVedleggId !== logiskVedleggId);
                continue dokumentLoop;
              }

              vedleggLoop: for (const vedlegg of dokument.vedlegg) {
                if (vedlegg.dokumentInfoId === dokumentInfoId) {
                  vedlegg.logiskeVedlegg = vedlegg.logiskeVedlegg.filter((v) => v.logiskVedleggId !== logiskVedleggId);
                  break vedleggLoop;
                }
              }
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useAddLogiskVedleggMutation, useDeleteLogiskVedleggMutation, useUpdateLogiskVedleggMutation } =
  logiskeVedleggSlice;
