import { IS_LOCALHOST } from '@app/redux/api/common';
import { registreringApi } from '@app/redux/api/registrering';

interface UpdatePartPayload {
  id: string;
  type: IdType.FNR;
}

const overstyringerSlice = registreringApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST ? true : 'throw',
  endpoints: (builder) => ({
    setMottattVedtaksinstans: builder.mutation<void, { id: string; mottattVedtaksinstans: string }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/overstyringer/mottatt-vedtaksinstans`,
        method: 'PUT',
        body,
      }),
    }),
    setMottattKlageinstans: builder.mutation<void, { id: string; mottattKlageinstans: string }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/overstyringer/mottatt-klageinstans`,
        method: 'PUT',
        body,
      }),
    }),
    setHjemmelIdList: builder.mutation<void, { id: string; hjemmelIdList: string[] }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/overstyringer/hjemmel-id-list`,
        method: 'PUT',
        body,
      }),
    }),
    setYtelseId: builder.mutation<void, { id: string; ytelseId: string }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/overstyringer/ytelse-id`,
        method: 'PUT',
        body,
      }),
    }),
    setFullmektig: builder.mutation<PartResponse, { id: string; fullmektig: UpdatePartPayload }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/overstyringer/fullmektig`,
        method: 'PUT',
        body,
      }),
    }),
    setKlager: builder.mutation<PartResponse, { id: string; klager: UpdatePartPayload }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/overstyringer/klager`,
        method: 'PUT',
        body,
      }),
    }),
    setAvsender: builder.mutation<PartResponse, { id: string; avsender: UpdatePartPayload }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/overstyringer/avsender`,
        method: 'PUT',
        body,
      }),
    }),
    setSaksbehandlerIdent: builder.mutation<void, { id: string; saksbehandlerIdent: string }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/overstyringer/saksbehandler-ident`,
        method: 'PUT',
        body,
      }),
    }),
    setOppgaveId: builder.mutation<void, { id: string; oppgaveId: string }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/overstyringer/oppgave-id`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const {
  useSetMottattVedtaksinstansMutation,
  useSetMottattKlageinstansMutation,
  useSetHjemmelIdListMutation,
  useSetYtelseIdMutation,
  useSetFullmektigMutation,
  useSetKlagerMutation,
  useSetAvsenderMutation,
  useSetSaksbehandlerIdentMutation,
  useSetOppgaveIdMutation,
} = overstyringerSlice;
