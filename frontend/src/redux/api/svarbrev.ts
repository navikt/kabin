import { IS_LOCALHOST } from '@app/redux/api/common';
import { registreringApi } from '@app/redux/api/registrering';
import { BehandlingstidUnitType } from '@app/types/calculate-frist';

export interface Behandlingstid {
  units: number;
  unitTypeId: BehandlingstidUnitType;
}

const svarbrevSlice = registreringApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST ? true : 'throw',
  endpoints: (builder) => ({
    setSvarbrevSend: builder.mutation<void, { id: string; send: boolean }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/svarbrev/send`,
        method: 'PUT',
        body,
      }),
    }),
    setSvarbrevBehandlingstid: builder.mutation<void, { id: string; behandlingstid: Behandlingstid }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/svarbrev/behandlingstid`,
        method: 'PUT',
        body,
      }),
    }),
    setSvarbrevFullmektigFritekst: builder.mutation<void, { id: string; fullmektigFritekst: string }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/svarbrev/fullmektig-fritekst`,
        method: 'PUT',
        body,
      }),
    }),
    setSvarbrevReceivers: builder.mutation<void, { id: string; receivers: Recipient[] }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/svarbrev/receivers`,
        method: 'PUT',
        body,
      }),
    }),
    setSvarbrevTitle: builder.mutation<void, { id: string; title: string }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/svarbrev/title`,
        method: 'PUT',
        body,
      }),
    }),
    setSvarbrevCustomText: builder.mutation<void, { id: string; customText: string }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/svarbrev/custom-text`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const {
  useSetSvarbrevSendMutation,
  useSetSvarbrevBehandlingstidMutation,
  useSetSvarbrevFullmektigFritekstMutation,
  useSetSvarbrevReceiversMutation,
  useSetSvarbrevTitleMutation,
  useSetSvarbrevCustomTextMutation,
} = svarbrevSlice;
