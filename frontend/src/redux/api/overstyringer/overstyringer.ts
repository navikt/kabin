/* eslint-disable max-lines */
import { IS_LOCALHOST } from '@app/redux/api/common';
import {
  SetBehandlingstidParams,
  SetHjemmelIdListParams,
  SetMottattKlageinstansParams,
  SetMottattVedtaksintansParams,
  SetOppgaveIdParams,
  SetSaksbehandlerIdentParams,
  SetYtelseParams,
} from '@app/redux/api/overstyringer/param-types';
import {
  SetAvsenderResponse,
  SetBehandlingstidResponse,
  SetFullmektigResponse,
  SetHjemmelIdListResponse,
  SetKlagerResponse,
  SetMottattKlageinstansResponse,
  SetMottattVedtaksintansResponse,
  SetOppgaveIdResponse,
  SetSaksbehandlerIdentResponse,
  SetYtelseResponse,
} from '@app/redux/api/overstyringer/response-types';
import { registreringApi } from '@app/redux/api/registreringer/registrering';
import { pessimisticOverstyringerUpdate, updateDrafts } from '@app/redux/api/registreringer/updates';
import { IPart } from '@app/types/common';

interface UpdatePartPayload {
  id: string;
  part: IPart | null;
}

const overstyringerSlice = registreringApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST ? true : 'throw',
  endpoints: (builder) => ({
    setMottattVedtaksinstans: builder.mutation<SetMottattVedtaksintansResponse, SetMottattVedtaksintansParams>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/overstyringer/mottatt-vedtaksinstans`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, mottattVedtaksinstans }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => {
          draft.overstyringer.mottattVedtaksinstans = mottattVedtaksinstans;

          return draft;
        });

        try {
          const { data } = await queryFulfilled;
          pessimisticOverstyringerUpdate(id, data.modified, data.overstyringer);
        } catch {
          undo();
        }
      },
    }),
    setMottattKlageinstans: builder.mutation<SetMottattKlageinstansResponse, SetMottattKlageinstansParams>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/overstyringer/mottatt-klageinstans`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, mottattKlageinstans }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => {
          draft.overstyringer.mottattKlageinstans = mottattKlageinstans;

          return draft;
        });

        try {
          const { data } = await queryFulfilled;
          pessimisticOverstyringerUpdate(id, data.modified, data.overstyringer);
        } catch {
          undo();
        }
      },
    }),
    setBehandlingstid: builder.mutation<SetBehandlingstidResponse, SetBehandlingstidParams>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/overstyringer/behandlingstid`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, ...body }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => {
          draft.overstyringer.behandlingstid = body;

          return draft;
        });

        try {
          const { data } = await queryFulfilled;
          pessimisticOverstyringerUpdate(id, data.modified, data.overstyringer);
        } catch {
          undo();
        }
      },
    }),
    setHjemmelIdList: builder.mutation<SetHjemmelIdListResponse, SetHjemmelIdListParams>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/overstyringer/hjemmel-id-list`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, hjemmelIdList }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => {
          draft.overstyringer.hjemmelIdList = hjemmelIdList;

          return draft;
        });

        try {
          const { data } = await queryFulfilled;
          pessimisticOverstyringerUpdate(id, data.modified, data.overstyringer);
        } catch {
          undo();
        }
      },
    }),
    setYtelseId: builder.mutation<SetYtelseResponse, SetYtelseParams>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/overstyringer/ytelse-id`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, ytelseId }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => {
          draft.overstyringer.ytelseId = ytelseId;
          draft.overstyringer.saksbehandlerIdent = null;

          return draft;
        });

        try {
          const { data } = await queryFulfilled;
          pessimisticOverstyringerUpdate(id, data.modified, data.overstyringer);
        } catch {
          undo();
        }
      },
    }),
    setFullmektig: builder.mutation<SetFullmektigResponse, UpdatePartPayload>({
      query: ({ id, part }) => ({
        url: `/registreringer/${id}/overstyringer/fullmektig`,
        method: 'PUT',
        body: part === null ? null : { type: part.type, id: part.id },
      }),
      onQueryStarted: async ({ id, part }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => {
          draft.overstyringer.fullmektig = part;

          return draft;
        });

        try {
          const { data } = await queryFulfilled;
          pessimisticOverstyringerUpdate(id, data.modified, data.overstyringer, data.svarbrev);
        } catch {
          undo();
        }
      },
    }),
    setKlager: builder.mutation<SetKlagerResponse, UpdatePartPayload>({
      query: ({ id, part }) => ({
        url: `/registreringer/${id}/overstyringer/klager`,
        method: 'PUT',
        body: part === null ? null : { type: part.type, id: part.id },
      }),
      onQueryStarted: async ({ id, part }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => {
          draft.overstyringer.klager = part;

          return draft;
        });

        try {
          await queryFulfilled;
        } catch {
          undo();
        }
      },
    }),
    setAvsender: builder.mutation<SetAvsenderResponse, UpdatePartPayload>({
      query: ({ id, part }) => ({
        url: `/registreringer/${id}/overstyringer/avsender`,
        method: 'PUT',
        body: part === null ? null : { type: part.type, id: part.id },
      }),
      onQueryStarted: async ({ id, part }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => {
          draft.overstyringer.avsender = part;

          return draft;
        });

        try {
          const { data } = await queryFulfilled;
          pessimisticOverstyringerUpdate(id, data.modified, data.overstyringer, data.svarbrev);
        } catch {
          undo();
        }
      },
    }),
    setSaksbehandlerIdent: builder.mutation<SetSaksbehandlerIdentResponse, SetSaksbehandlerIdentParams>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/overstyringer/saksbehandler-ident`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, saksbehandlerIdent }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => {
          draft.overstyringer.saksbehandlerIdent = saksbehandlerIdent;

          return draft;
        });

        try {
          const { data } = await queryFulfilled;
          pessimisticOverstyringerUpdate(id, data.modified, data.overstyringer);
        } catch {
          undo();
        }
      },
    }),
    setOppgaveId: builder.mutation<SetOppgaveIdResponse, SetOppgaveIdParams>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/overstyringer/oppgave-id`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, oppgaveId }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => {
          draft.overstyringer.oppgaveId = oppgaveId;

          return draft;
        });

        try {
          const { data } = await queryFulfilled;
          pessimisticOverstyringerUpdate(id, data.modified, data.overstyringer);
        } catch {
          undo();
        }
      },
    }),
  }),
});

export const {
  useSetAvsenderMutation,
  useSetBehandlingstidMutation,
  useSetFullmektigMutation,
  useSetHjemmelIdListMutation,
  useSetKlagerMutation,
  useSetMottattKlageinstansMutation,
  useSetMottattVedtaksinstansMutation,
  useSetOppgaveIdMutation,
  useSetSaksbehandlerIdentMutation,
  useSetYtelseIdMutation,
} = overstyringerSlice;
