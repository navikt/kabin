import { IS_LOCALHOST } from '@app/redux/api/common';
import type {
  SetBehandlingstidParams,
  SetGosysOppgaveIdParams,
  SetHjemmelIdListParams,
  SetMottattKlageinstansParams,
  SetMottattVedtaksintansParams,
  SetSaksbehandlerIdentParams,
  SetYtelseParams,
} from '@app/redux/api/overstyringer/param-types';
import type {
  SetAvsenderResponse,
  SetBehandlingstidResponse,
  SetFullmektigResponse,
  SetGosysOppgaveIdResponse,
  SetHjemmelIdListResponse,
  SetKlagerResponse,
  SetMottattKlageinstansResponse,
  SetMottattVedtaksintansResponse,
  SetSaksbehandlerIdentResponse,
  SetYtelseResponse,
} from '@app/redux/api/overstyringer/response-types';
import { pessimisticUpdate, updateDrafts } from '@app/redux/api/registreringer/queries';
import { registreringApi } from '@app/redux/api/registreringer/registrering';
import { BehandlingstidUnitType } from '@app/types/calculate-frist';
import type { IPart } from '@app/types/common';
import { addMonths, addWeeks, format } from 'date-fns';

interface UpdatePartPayload {
  id: string;
  part: IPart | null;
}

const overstyringerSlice = registreringApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    setMottattVedtaksinstans: builder.mutation<SetMottattVedtaksintansResponse, SetMottattVedtaksintansParams>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/overstyringer/mottatt-vedtaksinstans`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, mottattVedtaksinstans }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({
          ...draft,
          overstyringer: { ...draft.overstyringer, mottattVedtaksinstans },
        }));

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
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
          if (draft.overstyringer.behandlingstid === null) {
            return { ...draft, overstyringer: { ...draft.overstyringer, calculatedFrist: null, mottattKlageinstans } };
          }

          const calculatedFrist =
            draft.overstyringer.behandlingstid.unitTypeId === BehandlingstidUnitType.WEEKS
              ? format(addWeeks(mottattKlageinstans, draft.overstyringer.behandlingstid.units), 'yyyy-MM-dd')
              : format(addMonths(mottattKlageinstans, draft.overstyringer.behandlingstid.units), 'yyyy-MM-dd');

          return { ...draft, overstyringer: { ...draft.overstyringer, calculatedFrist, mottattKlageinstans } };
        });

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
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
      onQueryStarted: async ({ id, ...behandlingstid }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => {
          if (draft.overstyringer.mottattKlageinstans === null) {
            return { ...draft, overstyringer: { ...draft.overstyringer, calculatedFrist: null, behandlingstid } };
          }

          const calculatedFrist =
            behandlingstid.unitTypeId === BehandlingstidUnitType.WEEKS
              ? format(addWeeks(draft.overstyringer.mottattKlageinstans, behandlingstid.units), 'yyyy-MM-dd')
              : format(addMonths(draft.overstyringer.mottattKlageinstans, behandlingstid.units), 'yyyy-MM-dd');

          return { ...draft, overstyringer: { ...draft.overstyringer, calculatedFrist, behandlingstid } };
        });

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
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
        const undo = updateDrafts(id, (draft) => ({
          ...draft,
          overstyringer: { ...draft.overstyringer, hjemmelIdList },
        }));

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
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
        const undo = updateDrafts(id, (draft) => ({
          ...draft,
          overstyringer: { ...draft.overstyringer, ytelseId, saksbehandlerIdent: null },
        }));

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),
    setFullmektig: builder.mutation<SetFullmektigResponse, UpdatePartPayload>({
      query: ({ id, part }) => ({
        url: `/registreringer/${id}/overstyringer/fullmektig`,
        method: 'PUT',
        body: { fullmektig: part },
      }),
      onQueryStarted: async ({ id, part }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => {
          const result = { ...draft, overstyringer: { ...draft.overstyringer, fullmektig: part } };

          // Fullmektig is removed or set to klager (i.e. removed)
          if (part === null || part.identifikator === draft.overstyringer.klager?.identifikator) {
            const klagerIsReceiver = draft.svarbrev.receivers.some(
              (r) => r.part.identifikator === draft.overstyringer.klager?.identifikator,
            );

            const receivers = klagerIsReceiver
              ? draft.svarbrev.receivers
              : draft.svarbrev.receivers.filter(
                  (r) => r.part.identifikator !== draft.overstyringer.fullmektig?.identifikator,
                );

            return { ...result, svarbrev: { ...result.svarbrev, receivers } };
          }

          return result;
        });

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),
    setKlager: builder.mutation<SetKlagerResponse, UpdatePartPayload>({
      query: ({ id, part }) => ({
        url: `/registreringer/${id}/overstyringer/klager`,
        method: 'PUT',
        body: { klager: part },
      }),
      onQueryStarted: async ({ id, part }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => {
          const result = { ...draft, overstyringer: { ...draft.overstyringer, klager: part } };

          // Klager is removed or set to saken gjelder (i.e. removed)
          if (part === null || part.identifikator === draft.sakenGjelderValue) {
            const sakenGjelderIsReceiver = draft.svarbrev.receivers.some(
              (r) => r.part.identifikator === draft.sakenGjelderValue,
            );

            const receivers = sakenGjelderIsReceiver
              ? draft.svarbrev.receivers
              : draft.svarbrev.receivers.filter(
                  (r) => r.part.identifikator !== draft.overstyringer.klager?.identifikator,
                );

            return { ...result, svarbrev: { ...result.svarbrev, receivers } };
          }

          return result;
        });

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),
    setAvsender: builder.mutation<SetAvsenderResponse, UpdatePartPayload>({
      query: ({ id, part }) => ({
        url: `/registreringer/${id}/overstyringer/avsender`,
        method: 'PUT',
        body: { avsender: part },
      }),
      onQueryStarted: async ({ id, part }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({
          ...draft,
          overstyringer: { ...draft.overstyringer, avsender: part },
        }));

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
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
        const undo = updateDrafts(id, (draft) => ({
          ...draft,
          overstyringer: { ...draft.overstyringer, saksbehandlerIdent },
        }));

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),
    setOppgaveId: builder.mutation<SetGosysOppgaveIdResponse, SetGosysOppgaveIdParams>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/overstyringer/gosys-oppgave-id`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, gosysOppgaveId }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({
          ...draft,
          overstyringer: { ...draft.overstyringer, gosysOppgaveId },
        }));

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
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
