import { IS_LOCALHOST } from '@app/redux/api/common';
import { setRegistreringFn } from '@app/redux/api/registreringer/helpers';
import { RegistreringTagType, registreringApi } from '@app/redux/api/registreringer/registrering';
import {
  type DraftRegistrering,
  type FinishedRegistreringListItem,
  GET_FERDIGE_REGISTRERINGER_PARAMS,
  type Overstyringer,
  type Registrering,
  type Svarbrev,
} from '@app/redux/api/registreringer/types';
import { reduxStore } from '@app/redux/configure-store';
import type { IAnkemulighet, IKlagemulighet } from '@app/types/mulighet';

interface MuligheterResponse {
  klagemuligheter: IKlagemulighet[];
  ankemuligheter: IAnkemulighet[];
}

const queriesSlice = registreringApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getFerdigeRegistreringer: builder.query<FinishedRegistreringListItem[], { sidenDager: number }>({
      query: ({ sidenDager }) => `/registreringer/ferdige?sidenDager=${sidenDager}`,
    }),

    getUferdigeRegistreringer: builder.query<DraftRegistrering[], void>({
      query: () => '/registreringer/uferdige',
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        for (const registrering of data) {
          setRegistrering(registrering.id, registrering);
          dispatch(
            queriesSlice.util.upsertQueryData('getMuligheter', registrering.id, {
              klagemuligheter: registrering.klagemuligheter,
              ankemuligheter: registrering.ankemuligheter,
            }),
          );

          const { mulighet } = registrering;

          if (mulighet === null) {
            continue;
          }

          const klagemulighet = registrering.klagemuligheter.find((k) => k.id === mulighet.id);

          if (klagemulighet !== undefined) {
            dispatch(queriesSlice.util.upsertQueryData('getRegistreringKlagemulighet', registrering.id, klagemulighet));
          }

          const ankemulighet = registrering.ankemuligheter.find((a) => a.id === mulighet.id);

          if (ankemulighet !== undefined) {
            dispatch(queriesSlice.util.upsertQueryData('getRegistreringAnkemulighet', registrering.id, ankemulighet));
          }
        }
      },
    }),

    getRegistrering: builder.query<Registrering, string>({
      query: (id) => `/registreringer/${id}`,
      providesTags: (_, __, id) => [{ id, type: RegistreringTagType.REGISTRERING }],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        dispatch(
          queriesSlice.util.upsertQueryData('getMuligheter', data.id, {
            klagemuligheter: data.klagemuligheter,
            ankemuligheter: data.ankemuligheter,
          }),
        );

        const { mulighet } = data;

        if (mulighet === null) {
          return;
        }

        const klagemulighet = data.klagemuligheter.find((k) => k.id === mulighet.id);

        if (klagemulighet !== undefined) {
          dispatch(queriesSlice.util.upsertQueryData('getRegistreringKlagemulighet', data.id, klagemulighet));
        }

        const ankemulighet = data.ankemuligheter.find((a) => a.id === mulighet.id);

        if (ankemulighet !== undefined) {
          dispatch(queriesSlice.util.upsertQueryData('getRegistreringAnkemulighet', data.id, ankemulighet));
        }
      },
    }),

    getMuligheter: builder.query<MuligheterResponse, string>({
      query: (id) => `/registreringer/${id}/muligheter`,
      onQueryStarted: async (id, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;

        dispatch(
          queriesSlice.util.updateQueryData('getRegistrering', id, (draft) => {
            const { mulighet } = draft;

            if (mulighet === null) {
              return { ...draft, ...data };
            }

            const klagemulighet = data.klagemuligheter.find((k) => k.id === mulighet.id);

            if (klagemulighet !== undefined) {
              dispatch(queriesSlice.util.upsertQueryData('getRegistreringKlagemulighet', id, klagemulighet));

              return { ...draft, ...data };
            }

            const ankemulighet = data.ankemuligheter.find((a) => a.id === mulighet.id);

            if (ankemulighet !== undefined) {
              dispatch(queriesSlice.util.upsertQueryData('getRegistreringAnkemulighet', id, ankemulighet));

              return { ...draft, ...data };
            }
          }),
        );
      },
    }),

    getRegistreringKlagemulighet: builder.query<IKlagemulighet, string>({
      query: (id) => `/registreringer/${id}/klagemulighet`,
    }),

    getRegistreringAnkemulighet: builder.query<IAnkemulighet, string>({
      query: (id) => `/registreringer/${id}/ankemulighet`,
    }),
  }),
});

export const { useLazyGetMuligheterQuery, useGetFerdigeRegistreringerQuery, useGetRegistreringQuery } = queriesSlice;

// Registrering
export const updateRegistrering = (id: string, update: UpdateFn<Registrering>) =>
  reduxStore.dispatch(queriesSlice.util.updateQueryData('getRegistrering', id, update));

export const removeRegistrering = (id: string) =>
  reduxStore.dispatch(queriesSlice.util.updateQueryData('getRegistrering', id, () => undefined));

export const setRegistrering = (id: string, data: Registrering) =>
  reduxStore.dispatch(queriesSlice.util.upsertQueryData('getRegistrering', id, data));

// Uferdig registrering
export const setUferdigRegistrering = (data: DraftRegistrering) =>
  reduxStore.dispatch(
    queriesSlice.util.updateQueryData('getUferdigeRegistreringer', undefined, (draft) =>
      setRegistreringFn(draft, data),
    ),
  );
const updateUferdigRegistrering = (id: string, update: UpdateFn) =>
  reduxStore.dispatch(
    queriesSlice.util.updateQueryData('getUferdigeRegistreringer', undefined, (draft) =>
      draft.map((d) => (d.id === id ? update(d) : d)),
    ),
  );

export const removeUferdigRegistrering = (id: string) =>
  reduxStore.dispatch(
    queriesSlice.util.updateQueryData('getUferdigeRegistreringer', undefined, (draft) =>
      draft.filter((d) => d.id !== id),
    ),
  );

// Ferdig registrering
export const updateFerdigRegistrering = (finishedRegistrering: FinishedRegistreringListItem) =>
  reduxStore.dispatch(
    queriesSlice.util.updateQueryData('getFerdigeRegistreringer', GET_FERDIGE_REGISTRERINGER_PARAMS, (draft) => [
      finishedRegistrering,
      ...draft,
    ]),
  );

export const removeFerdigRegistrering = (id: string) =>
  reduxStore.dispatch(
    queriesSlice.util.updateQueryData('getFerdigeRegistreringer', GET_FERDIGE_REGISTRERINGER_PARAMS, (draft) =>
      draft.filter((d) => d.id !== id),
    ),
  );

type UpdateFn<T extends Registrering = DraftRegistrering, R extends Registrering = T> = (draft: T) => R;

// All drafts
export const updateDrafts = (id: string, update: UpdateFn<DraftRegistrering>): (() => void) => {
  const patchResult = updateRegistrering(id, (draft) => (draft.finished === null ? update(draft) : draft));
  const unfinishedPatchResult = updateUferdigRegistrering(id, update);

  return () => {
    patchResult.undo();
    unfinishedPatchResult.undo();
  };
};

interface PartialDraftRegistrering extends Partial<Omit<DraftRegistrering, 'overstyringer' | 'svarbrev'>> {
  overstyringer?: Partial<Overstyringer>;
  svarbrev?: Partial<Svarbrev>;
}

export const pessimisticUpdate = (id: string, response: PartialDraftRegistrering = {}) =>
  updateDrafts(id, (draft) => ({
    ...draft,
    ...response,
    overstyringer: { ...draft.overstyringer, ...response.overstyringer },
    svarbrev: { ...draft.svarbrev, ...response.svarbrev },
  }));
