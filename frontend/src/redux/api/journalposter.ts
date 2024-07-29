import { createApi } from '@reduxjs/toolkit/query/react';
import { API_BASE_QUERY } from '@app/redux/api/common';
import { IArkivertDocument } from '@app/types/dokument';

export const arkiverteDokumenterApi = createApi({
  reducerPath: 'arkiverteDokumenterApi',
  baseQuery: API_BASE_QUERY,
  endpoints: (builder) => ({
    getArkiverteDokumenter: builder.query<{ dokumenter: IArkivertDocument[] }, string>({
      query: (idnummer) => ({
        url: '/kabin-api/arkivertedokumenter?antall=50000',
        method: 'POST',
        body: { idnummer },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        for (const dokument of data.dokumenter) {
          dispatch(
            arkiverteDokumenterApi.util.updateQueryData('getArkivertDokument', dokument.dokumentInfoId, () => dokument),
          );
        }
      },
    }),
    getArkivertDokument: builder.query<IArkivertDocument, string>({
      query: (id) => `/kabin-api/arkivertedokumenter/${id}`, // TODO: Finnes ikke i backend. Hva trenger vi av data?
    }),
  }),
});

export const { useGetArkiverteDokumenterQuery, useLazyGetArkivertDokumentQuery } = arkiverteDokumenterApi;
