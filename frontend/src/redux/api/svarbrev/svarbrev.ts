/* eslint-disable max-lines */
import { formatISO } from 'date-fns';
import { IS_LOCALHOST } from '@app/redux/api/common';
import { registreringApi } from '@app/redux/api/registreringer/registrering';
import { Behandlingstid } from '@app/redux/api/registreringer/types';
import { updateDrafts } from '@app/redux/api/registreringer/updates';
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
  overrideExisting: IS_LOCALHOST ? true : 'throw',
  endpoints: (builder) => ({
    setSvarbrevSend: builder.mutation<SetSendResponse, SetSendParams>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/svarbrev/send`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, send }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => {
          draft.svarbrev.send = send;

          return draft;
        });

        try {
          const { data } = await queryFulfilled;
          updateDrafts(id, (draft) => {
            draft.modified = data.modified;
            draft.svarbrev.send = data.svarbrev.send;

            return draft;
          });
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
        const undo = updateDrafts(id, (draft) => {
          draft.svarbrev.behandlingstid = behandlingstid;

          return draft;
        });

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
        const undo = updateDrafts(id, (draft) => {
          draft.svarbrev.fullmektigFritekst = fullmektigFritekst;

          return draft;
        });

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
          draft.svarbrev.receivers.push(receiver);

          return draft;
        });

        try {
          const { data } = await queryFulfilled;
          updateDrafts(id, (draft) => {
            draft.modified = data.modified;
            draft.svarbrev.receivers = data.svarbrev.receivers;

            return draft;
          });
        } catch {
          undo();
        }
      },
    }),
    changeSvarbrevReceiver: builder.mutation<ReceiverResponse, ChangeReceiverParams>({
      query: ({ id, receiver }) => ({
        url: `/registreringer/${id}/svarbrev/receivers/${receiver.part.id}`,
        method: 'PUT',
        body: receiver,
      }),
      onQueryStarted: async ({ id, receiver }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => {
          for (const r of draft.svarbrev.receivers) {
            if (r.part.id === receiver.part.id) {
              r.part = receiver.part;
              r.handling = receiver.handling;
              r.overriddenAddress = receiver.overriddenAddress;
              break;
            }
          }

          return draft;
        });

        try {
          const { data } = await queryFulfilled;
          updateDrafts(id, (draft) => {
            draft.modified = data.modified;
            draft.svarbrev.receivers = data.svarbrev.receivers;

            return draft;
          });
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
        const undo = updateDrafts(id, (draft) => {
          draft.svarbrev.receivers = draft.svarbrev.receivers.filter((r) => r.part.id !== receiverId);

          return draft;
        });

        try {
          const { data } = await queryFulfilled;
          updateDrafts(id, (draft) => {
            draft.modified = data.modified;
            draft.svarbrev.receivers = data.svarbrev.receivers;

            return draft;
          });
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
        const undo = updateDrafts(id, (draft) => {
          draft.svarbrev.title = title.trim().length === 0 ? DEFAULT_SVARBREV_NAME : title;
          draft.modified = formatISO(new Date());

          return draft;
        });

        try {
          const { data } = await queryFulfilled;
          updateDrafts(id, (draft) => {
            draft.modified = data.modified;
            draft.svarbrev.title = data.svarbrev.title;

            return draft;
          });
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
        const undo = updateDrafts(id, (draft) => {
          draft.svarbrev.customText = customText;

          return draft;
        });

        try {
          const { data } = await queryFulfilled;
          updateDrafts(id, (draft) => {
            draft.modified = data.modified;
            draft.svarbrev.customText = data.svarbrev.customText;

            return draft;
          });
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
        const undo = updateDrafts(id, (draft) => {
          draft.svarbrev.overrideBehandlingstid = overrideBehandlingstid;

          return draft;
        });

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
        const undo = updateDrafts(id, (draft) => {
          draft.svarbrev.overrideCustomText = overrideCustomText;

          return draft;
        });

        try {
          const { data } = await queryFulfilled;
          updateDrafts(id, (draft) => {
            draft.modified = data.modified;
            draft.svarbrev.overrideCustomText = data.svarbrev.overrideCustomText;

            return draft;
          });
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
