import { IS_LOCALHOST } from '@app/redux/api/common';
import { setRegistreringFn } from '@app/redux/api/registreringer/helpers';
import { RegistreringTagType, registreringApi } from '@app/redux/api/registreringer/registrering';
import {
  type DraftRegistrering,
  type FinishedRegistreringListItem,
  GET_FERDIGE_REGISTRERINGER_PARAMS,
  type Registrering,
} from '@app/redux/api/registreringer/types';
import { reduxStore } from '@app/redux/configure-store';
import type {
  IAdditionalKabalMulighet,
  IAnkemulighet,
  IBegjæringOmGjenopptakMulighet,
  IKlagemulighet,
  IOmgjøringskravmulighet,
} from '@app/types/mulighet';

interface MuligheterResponse {
  klagemuligheter: IKlagemulighet[];
  ankemuligheter: IAnkemulighet[];
  omgjoeringskravmuligheter: IOmgjøringskravmulighet[];
  gjenopptaksmuligheter: IBegjæringOmGjenopptakMulighet[];
  muligheterFetched: string;
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

          dispatch(queriesSlice.util.upsertQueryData('getMuligheter', registrering.id, registrering.muligheter));
        }
      },
    }),

    getRegistrering: builder.query<Registrering, string>({
      query: (id) => `/registreringer/${id}`,
      providesTags: (_, __, id) => [{ id, type: RegistreringTagType.REGISTRERING }],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        dispatch(queriesSlice.util.upsertQueryData('getMuligheter', data.id, data.muligheter));
      },
    }),

    getMuligheter: builder.query<MuligheterResponse, string>({
      query: (id) => `/registreringer/${id}/muligheter`,
      onQueryStarted: async (id, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;

        dispatch(
          queriesSlice.util.updateQueryData('getRegistrering', id, (draft) => ({
            ...draft,
            muligheter: { ...draft.muligheter, ...data },
          })),
        );
      },
    }),

    getAdditionalKabalMuligheter: builder.query<IAdditionalKabalMulighet[], string>({
      query: (id) => `/registreringer/${id}/additional-kabal-muligheter`,
      onQueryStarted: async (id, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;

        dispatch(
          queriesSlice.util.updateQueryData('getRegistrering', id, (draft) => ({
            ...draft,
            additionalKabalMuligheter: data,
          })),
        );
      },
    }),
  }),
});

export const {
  useLazyGetMuligheterQuery,
  useGetFerdigeRegistreringerQuery,
  useGetRegistreringQuery,
  useLazyGetAdditionalKabalMuligheterQuery,
} = queriesSlice;

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
export const updateUferdigRegistrering = (id: string, update: UpdateFn) =>
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

export type UpdateFn<T extends Registrering = DraftRegistrering, R extends Registrering = T> = (draft: T) => R;
