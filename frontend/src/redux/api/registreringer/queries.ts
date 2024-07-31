import { setRegistreringFn } from '@app/redux/api/registreringer/helpers';
import { registreringApi } from '@app/redux/api/registreringer/registrering';
import {
  DraftRegistrering,
  FinishedRegistrering,
  FinishingRegistrering,
  Registrering,
} from '@app/redux/api/registreringer/types';

export const queriesSlice = registreringApi.injectEndpoints({
  endpoints: (builder) => ({
    getFerdigeRegistreringer: builder.query<(FinishedRegistrering | FinishingRegistrering)[], void>({
      query: () => `/registreringer/ferdige?sidenDager=30`,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        for (const registrering of data) {
          dispatch(queriesSlice.util.updateQueryData('getRegistrering', registrering.id, () => registrering));
        }
      },
    }),

    getUferdigeRegistreringer: builder.query<DraftRegistrering[], void>({
      query: () => `/registreringer/uferdige`,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        for (const registrering of data) {
          dispatch(queriesSlice.util.updateQueryData('getRegistrering', registrering.id, () => registrering));
        }
      },
    }),

    getRegistrering: builder.query<Registrering, string>({
      query: (id) => `/registreringer/${id}`,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        dispatch(
          queriesSlice.util.updateQueryData(
            data.finished === null ? 'getUferdigeRegistreringer' : 'getFerdigeRegistreringer',
            undefined,
            (draft) => setRegistreringFn(draft, data),
          ),
        );
      },
    }),
  }),
});

export const { useGetFerdigeRegistreringerQuery, useGetUferdigeRegistreringerQuery, useGetRegistreringQuery } =
  queriesSlice;
