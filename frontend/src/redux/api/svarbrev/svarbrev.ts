import { IS_LOCALHOST } from '@app/redux/api/common';
import { pessimisticUpdate, updateDrafts } from '@app/redux/api/registreringer/queries';
import { registreringApi } from '@app/redux/api/registreringer/registrering';
import type {
  AddReceiverParams,
  ChangeReceiverParams,
  RemoveReceiverParams,
  SetCustomTextParams,
  SetInitialCustomTextParams,
  SetOverrideCustomTextParams,
  SetSendParams,
  SetSvarbrevBehandlingstidParams,
  SetSvarbrevOverrideBehandlingstidParams,
  SetSvarbrevTitleParams,
} from '@app/redux/api/svarbrev/param-types';
import type {
  ReceiverResponse,
  SetOverrideCustomTextResponse,
  SetSvarbrevBehandlingstidResponse,
  SetSvarbrevCustomTextResponse,
  SetSvarbrevFullmektigFritekst,
  SetSvarbrevInitialCustomTextResponse,
  SetSvarbrevNoReasonResponse,
  SetSvarbrevOverrideBehandlingstidResponse,
  SetSvarbrevSendResponse,
  SetSvarbrevTitleResponse,
} from '@app/redux/api/svarbrev/response-types';
import { BehandlingstidUnitType } from '@app/types/calculate-frist';
import { SaksTypeEnum } from '@app/types/common';
import { formatISO } from 'date-fns';

export const DEFAULT_SVARBREV_NAME = 'Klageinstans orienterer om saksbehandlingen';

const svarbrevSlice = registreringApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    setSvarbrevSend: builder.mutation<SetSvarbrevSendResponse, SetSendParams>({
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
    setSvarbrevBehandlingstid: builder.mutation<SetSvarbrevBehandlingstidResponse, SetSvarbrevBehandlingstidParams>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/svarbrev/behandlingstid`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, ...behandlingstid }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({ ...draft, svarbrev: { ...draft.svarbrev, behandlingstid } }));

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),
    setSvarbrevFullmektigFritekst: builder.mutation<
      SetSvarbrevFullmektigFritekst,
      { id: string; fullmektigFritekst: string | null }
    >({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/svarbrev/fullmektig-fritekst`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, fullmektigFritekst }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({ ...draft, svarbrev: { ...draft.svarbrev, fullmektigFritekst } }));

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
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
    setSvarbrevTitle: builder.mutation<SetSvarbrevTitleResponse, SetSvarbrevTitleParams>({
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
    setSvarbrevCustomText: builder.mutation<SetSvarbrevCustomTextResponse, SetCustomTextParams>({
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
    setSvarbrevInitialCustomText: builder.mutation<SetSvarbrevInitialCustomTextResponse, SetInitialCustomTextParams>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/svarbrev/initial-custom-text`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, initialCustomText }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({
          ...draft,
          svarbrev: { ...draft.svarbrev, initialCustomText },
        }));

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),
    setSvarbrevOverrideBehandlingstid: builder.mutation<
      SetSvarbrevOverrideBehandlingstidResponse,
      SetSvarbrevOverrideBehandlingstidParams
    >({
      query: ({ id, overrideBehandlingstid }) => ({
        url: `/registreringer/${id}/svarbrev/override-behandlingstid`,
        method: 'PUT',
        body: { overrideBehandlingstid },
      }),
      onQueryStarted: async ({ id, overrideBehandlingstid, typeId }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({
          ...draft,
          svarbrev: {
            ...draft.svarbrev,
            overrideBehandlingstid,
            behandlingstid: overrideBehandlingstid
              ? draft.svarbrev.behandlingstid
              : {
                  unitTypeId: BehandlingstidUnitType.WEEKS,
                  units: getDefaultBehandlingstid(typeId, BehandlingstidUnitType.WEEKS),
                },
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
    setSvarbrevOverrideCustomText: builder.mutation<SetOverrideCustomTextResponse, SetOverrideCustomTextParams>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/svarbrev/override-custom-text`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, overrideCustomText }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({
          ...draft,
          svarbrev: {
            ...draft.svarbrev,
            overrideCustomText,
            customText: overrideCustomText ? draft.svarbrev.customText : null,
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
    setSvarbrevReasonNoLetter: builder.mutation<SetSvarbrevNoReasonResponse, { id: string; reasonNoLetter: string }>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/svarbrev/reason-no-letter`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, reasonNoLetter }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({
          ...draft,
          svarbrev: { ...draft.svarbrev, reasonNoLetter },
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

export const getDefaultBehandlingstid = (typeId: SaksTypeEnum | null, unitType: BehandlingstidUnitType) => {
  if (unitType === BehandlingstidUnitType.WEEKS) {
    return typeId === SaksTypeEnum.ANKE ? 11 : 12;
  }

  return 3;
};

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
  useSetSvarbrevInitialCustomTextMutation,
  useSetSvarbrevReasonNoLetterMutation,
} = svarbrevSlice;
