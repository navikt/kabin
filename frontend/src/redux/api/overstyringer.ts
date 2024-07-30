import { IS_LOCALHOST } from '@app/redux/api/common';
import { registreringApi } from '@app/redux/api/registrering';
import { BehandlingstidUnitType } from '@app/types/calculate-frist';
import { AvsenderMottakerType, IdType } from '@app/types/common';

interface UpdatePartPayload {
  id: string;
  type: IdType | AvsenderMottakerType;
}

interface BehandlingstidPayload {
  units: number;
  unitType: BehandlingstidUnitType;
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
    setBehandlingstid: builder.mutation<void, { id: string } & BehandlingstidPayload>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/overstyringer/behandlingstid`,
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
    setFullmektig: builder.mutation<PartResponse, { id: string; part: UpdatePartPayload | null }>({
      query: ({ id, part: body }) => ({
        url: `/kabin-api/registreringer/${id}/overstyringer/fullmektig`,
        method: 'PUT',
        body,
      }),
    }),
    setKlager: builder.mutation<PartResponse, { id: string; part: UpdatePartPayload | null }>({
      query: ({ id, part: body }) => ({
        url: `/kabin-api/registreringer/${id}/overstyringer/klager`,
        method: 'PUT',
        body,
      }),
    }),
    setAvsender: builder.mutation<PartResponse, { id: string; part: UpdatePartPayload | null }>({
      query: ({ id, part: body }) => ({
        url: `/kabin-api/registreringer/${id}/overstyringer/avsender`,
        method: 'PUT',
        body,
      }),
    }),
    setSaksbehandlerIdent: builder.mutation<void, { id: string; saksbehandlerIdent: string | null }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/overstyringer/saksbehandler-ident`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, saksbehandlerIdent }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          registreringApi.util.updateQueryData('getRegistrering', id, (draft) => {
            draft.overstyringer.saksbehandlerIdent = saksbehandlerIdent;
          }),
        );

        const uferdigePatchResult = dispatch(
          registreringApi.util.updateQueryData('getUferdigeRegistreringer', undefined, (draft) => {
            for (const registrering of draft) {
              if (registrering.id === id) {
                registrering.overstyringer.saksbehandlerIdent = saksbehandlerIdent;
              }
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          uferdigePatchResult.undo();
        }
      },
    }),
    setOppgaveId: builder.mutation<void, { id: string; oppgaveId: number | null }>({
      query: ({ id, ...body }) => ({
        url: `/kabin-api/registreringer/${id}/overstyringer/oppgave-id`,
        method: 'PUT',
        body,
      }),
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
