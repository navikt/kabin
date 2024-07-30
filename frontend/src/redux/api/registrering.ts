import { createApi } from '@reduxjs/toolkit/query/react';
import { formatISO } from 'date-fns';
import { Recipient } from '@app/pages/create/app-context/types';
import { API_BASE_QUERY } from '@app/redux/api/common';
import { BehandlingstidUnitType } from '@app/types/calculate-frist';
import { IPart, SaksTypeEnum } from '@app/types/common';

interface Behandlingstid {
  units: number;
  unitType: BehandlingstidUnitType;
}

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
  oppgaveId: string | null; // TODO: Should be a number. Waiting for backend to fix this.
}

export interface Svarbrev {
  send: boolean;
  overrideBehandlingstid: boolean;
  behandlingstid: Behandlingstid | null;
  fullmektigFritekst: string | null;
  receivers: Recipient[];
  title: string; // default DEFAULT_SVARBREV_NAME
  overrideCustomText: boolean;
  customText: string | null;
}

interface SetMulighetPayload {
  mulighetId: string;
  fagsystemId: string;
}

export interface MulighetId {
  id: string;
  fagsystemId: string;
}

export interface Registrering {
  id: string;
  sakenGjelderValue: string | null;
  journalpostId: string | null;
  typeId: SaksTypeEnum | null; // Samme type-IDer som i Kodeverket.
  mulighet: MulighetId | null;
  overstyringer: Overstyringer;
  svarbrev: Svarbrev;
  /** When the registration was finished. `null` if not finished.
   * @type: DateTime | null
   */
  finished: string | null;
  created: string;
  modified: string;
  createdBy: string;
}

export const registreringApi = createApi({
  reducerPath: 'registreringApi',
  baseQuery: API_BASE_QUERY,
  endpoints: (builder) => ({
    getFerdigeRegistreringer: builder.query<Registrering[], { sidenDager?: number }>({
      query: ({ sidenDager }) =>
        `/kabin-api/registreringer/ferdige${typeof sidenDager === 'number' ? `?sidenDager=${sidenDager.toString()}` : ''}`,
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
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(registreringApi.util.updateQueryData('getRegistrering', data.id, () => data));
        dispatch(
          registreringApi.util.updateQueryData('getUferdigeRegistreringer', undefined, (draft) =>
            draft.every((d) => d.id !== data.id) ? [...draft, data] : draft,
          ),
        );
      },
    }),
    deleteRegistrering: builder.mutation<void, string>({
      query: (id) => ({
        url: `/kabin-api/registreringer/${id}`,
        method: 'DELETE',
      }),
    }),
    finishRegistrering: builder.mutation<{ finished: string; behandlingId: string }, string>({
      query: (id) => ({
        url: `/kabin-api/registreringer/${id}/finish`,
        method: 'POST',
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const finished = formatISO(new Date());

        const patchResult = dispatch(
          registreringApi.util.updateQueryData('getRegistrering', id, (draft) => ({ ...draft, finished })),
        );

        const unfinishedPatchResult = dispatch(
          registreringApi.util.updateQueryData('getUferdigeRegistreringer', undefined, (draft) =>
            draft.filter((d) => d.id !== id),
          ),
        );

        const finishedPatchResult = dispatch(
          registreringApi.util.updateQueryData('getFerdigeRegistreringer', undefined, (draft) =>
            draft.map((d) => (d.id === id ? { ...d, finished } : d)),
          ),
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(registreringApi.util.updateQueryData('getRegistrering', id, (draft) => ({ ...draft, ...data })));

          dispatch(
            registreringApi.util.updateQueryData('getUferdigeRegistreringer', undefined, (draft) =>
              draft.filter((d) => d.id !== id),
            ),
          );

          dispatch(
            registreringApi.util.updateQueryData('getFerdigeRegistreringer', undefined, (draft) =>
              draft.map((d) => (d.id === id ? { ...d, ...data } : d)),
            ),
          );
        } catch (error) {
          patchResult.undo();
          unfinishedPatchResult.undo();
          finishedPatchResult.undo();
        }
      },
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
    setType: builder.mutation<void, { id: string; typeId: SaksTypeEnum }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/type-id`,
        method: 'PUT',
        body,
      }),
    }),
    setMulighet: builder.mutation<void, { id: string } & SetMulighetPayload>({
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
  useFinishRegistreringMutation,
} = registreringApi;
