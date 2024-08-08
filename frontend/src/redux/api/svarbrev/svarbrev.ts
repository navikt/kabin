/* eslint-disable max-lines */
import { formatISO } from 'date-fns';
import { IS_LOCALHOST } from '@app/redux/api/common';
import { registreringApi } from '@app/redux/api/registreringer/registrering';
import { Behandlingstid } from '@app/redux/api/registreringer/types';
import { pessimisticUpdate, updateDrafts } from '@app/redux/api/registreringer/updates';
import {
  AddReceiverParams,
  ChangeReceiverParams,
  RemoveReceiverParams,
  SetOverrideCustomTextParams,
  SetSendParams,
} from '@app/redux/api/svarbrev/param-types';
import {
  ReceiverResponse,
  SetCustomTextResponse,
  SetOverrideCustomTextResponse,
  SetSendResponse,
  SetTitleResponse,
} from '@app/redux/api/svarbrev/response-types';

export const DEFAULT_SVARBREV_NAME = 'NAV orienterer om saksbehandlingen';

const svarbrevSlice = registreringApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    setSvarbrevSend: builder.mutation<SetSendResponse, SetSendParams>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/svarbrev/send`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, send }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({ ...draft, svarbrev: { ...draft.svarbrev, send } }));

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),
    setSvarbrevBehandlingstid: builder.mutation<void, { id: string } & Behandlingstid>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/svarbrev/behandlingstid`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, ...behandlingstid }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({ ...draft, svarbrev: { ...draft.svarbrev, behandlingstid } }));

        try {
          await queryFulfilled;
          // TODO: Backend should return modified date and side-effects.
        } catch {
          undo();
        }
      },
    }),
    setSvarbrevFullmektigFritekst: builder.mutation<void, { id: string; fullmektigFritekst: string | null }>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/svarbrev/fullmektig-fritekst`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, fullmektigFritekst }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({ ...draft, svarbrev: { ...draft.svarbrev, fullmektigFritekst } }));

        try {
          await queryFulfilled;
          // TODO: Backend should return modified date and side-effects.
        } catch {
          undo();
        }
      },
    }),
    addSvarbrevReceiver: builder.mutation<ReceiverResponse, AddReceiverParams>({
      query: ({ id, receiver }) => ({
        url: `/registreringer/${id}/svarbrev/receivers`,
        method: 'POST',
        body: receiver,
      }),
      onQueryStarted: async ({ id, receiver }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => {
          const receivers = [...draft.svarbrev.receivers, { ...receiver, id: 'unknown' }].toSorted((a, b) =>
            (a.part.name ?? '').localeCompare(b.part.name ?? ''),
          );

          return { ...draft, svarbrev: { ...draft.svarbrev, receivers } };
        });

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),
    changeSvarbrevReceiver: builder.mutation<ReceiverResponse, ChangeReceiverParams>({
      query: ({ id, receiverId, ...body }) => ({
        url: `/registreringer/${id}/svarbrev/receivers/${receiverId}`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, receiverId, handling, overriddenAddress }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => {
          const receivers = draft.svarbrev.receivers.map((r) =>
            r.id === receiverId ? { ...r, handling, overriddenAddress } : r,
          );

          return { ...draft, svarbrev: { ...draft.svarbrev, receivers } };
        });

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),
    removeSvarbrevReceiver: builder.mutation<ReceiverResponse, RemoveReceiverParams>({
      query: ({ id, receiverId }) => ({
        url: `/registreringer/${id}/svarbrev/receivers/${receiverId}`,
        method: 'DELETE',
      }),
      onQueryStarted: async ({ id, receiverId }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({
          ...draft,
          svarbrev: {
            ...draft.svarbrev,
            receivers: draft.svarbrev.receivers.filter((r) => r.id !== receiverId),
          },
        }));

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),
    setSvarbrevTitle: builder.mutation<SetTitleResponse, { id: string; title: string }>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/svarbrev/title`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, title }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({
          ...draft,
          svarbrev: { ...draft.svarbrev, title: title.trim().length === 0 ? DEFAULT_SVARBREV_NAME : title },
          modified: formatISO(new Date()),
        }));

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),
    setSvarbrevCustomText: builder.mutation<SetCustomTextResponse, { id: string; customText: string }>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/svarbrev/custom-text`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, customText }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({ ...draft, svarbrev: { ...draft.svarbrev, customText } }));

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),
    setSvarbrevOverrideBehandlingstid: builder.mutation<void, { id: string; overrideBehandlingstid: boolean }>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/svarbrev/override-behandlingstid`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, overrideBehandlingstid }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({
          ...draft,
          svarbrev: { ...draft.svarbrev, overrideBehandlingstid },
        }));

        try {
          await queryFulfilled;
          // TODO: Backend should return modified date and side-effects.
        } catch {
          undo();
        }
      },
    }),
    setSvarbrevOverrideCustomText: builder.mutation<SetOverrideCustomTextResponse, SetOverrideCustomTextParams>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/svarbrev/override-custom-text`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, overrideCustomText }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({ ...draft, svarbrev: { ...draft.svarbrev, overrideCustomText } }));

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
  useSetSvarbrevSendMutation,
  useSetSvarbrevBehandlingstidMutation,
  useSetSvarbrevFullmektigFritekstMutation,
  useAddSvarbrevReceiverMutation,
  useChangeSvarbrevReceiverMutation,
  useRemoveSvarbrevReceiverMutation,
  useSetSvarbrevTitleMutation,
  useSetSvarbrevCustomTextMutation,
  useSetSvarbrevOverrideBehandlingstidMutation,
  useSetSvarbrevOverrideCustomTextMutation,
} = svarbrevSlice;
