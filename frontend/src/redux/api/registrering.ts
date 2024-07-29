import { createApi } from '@reduxjs/toolkit/query/react';
import { API_BASE_QUERY } from '@app/redux/api/common';
import { TypeId } from '@app/types/mulighet';

export interface Overstyringer {
  mottattVedtaksinstans: string | null; // Date, ikke relevant for anke
  mottattKlageinstans: string | null; // Date
  behandlingstid: Behandlingstid | null;
  hjemmelIdList: string[] | null;
  ytelseId: string | null;
  fullmektig: IPart | null;
  klager: IPart | null;
  avsender: IPart | null;
  /** NAV ident */
  saksbehandlerIdent: string | null;
  /** Gosys-oppgave */
  oppgaveId: string | null;
}

export interface Svarbrev {
  send: boolean;
  behandlingstid: Behandlingstid | null;
  fullmektigFritekst: string | null;
  receivers: Recipient[];
  title: string; // default DEFAULT_SVARBREV_NAME
  customText: string | null;
}

interface SetMulighetPayload {
  id: string;
  sourceId: string;
}

export interface Registrering {
  id: string;
  sakenGjelderValue: string | null;
  journalpostId: string | null;
  typeId: TypeId | null; // Samme type-IDer som i Kodeverket.
  mulighet: SetMulighetPayload | null;
  overstyringer: Overstyringer;
  svarbrev: Svarbrev;
  /** When the registration was finished. `null` if not finished.
   * @type: DateTime | null
   */
  finished: string | null;
}

export const registreringApi = createApi({
  reducerPath: 'registreringApi',
  baseQuery: API_BASE_QUERY,
  endpoints: (builder) => ({
    getFerdigeRegistreringer: builder.query<Registrering[], void>({
      query: () => `/kabin-api/registreringer/ferdige`,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        for (const registrering of data) {
          dispatch(registreringApi.util.updateQueryData('getRegistrering', registrering.id, () => registrering));
        }
      },
    }),
    getUferdigeRegistreringer: builder.query<Registrering[], void>({
      query: () => `/kabin-api/registreringer/uferdige`,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        for (const registrering of data) {
          dispatch(registreringApi.util.updateQueryData('getRegistrering', registrering.id, () => registrering));
        }
      },
    }),
    getRegistrering: builder.query<Registrering, string>({
      query: (id) => `/kabin-api/registreringer/${id}`,
    }),
    createRegistrering: builder.mutation<Registrering, void>({
      query: () => ({
        url: '/kabin-api/registreringer',
        method: 'POST',
      }),
    }),
    deleteRegistrering: builder.mutation<void, string>({
      query: (id) => ({
        url: `/kabin-api/registreringer/${id}`,
        method: 'DELETE',
      }),
    }),
    setSakenGjelder: builder.mutation<void, { id: string; sakenGjelderValue: string }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/saken-gjelder-value`,
        method: 'PUT',
        body,
      }),
    }),
    setJournalpostId: builder.mutation<void, { id: string; journalpostId: string | null }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/journalpost-id`,
        method: 'PUT',
        body,
      }),
    }),
    setType: builder.mutation<void, { id: string; typeId: TypeId }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/type-id`,
        method: 'PUT',
        body,
      }),
    }),
    setMulighet: builder.mutation<void, { id: string; mulighet: SetMulighetPayload }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/mulighet`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const {
  useGetFerdigeRegistreringerQuery,
  useGetUferdigeRegistreringerQuery,
  useGetRegistreringQuery,
  useCreateRegistreringMutation,
  useSetSakenGjelderMutation,
  useSetJournalpostIdMutation,
  useSetTypeMutation,
  useSetMulighetMutation,
  useDeleteRegistreringMutation,
} = registreringApi;
