import { IS_LOCALHOST } from '@app/redux/api/common';
import { setRegistreringFn } from '@app/redux/api/registreringer/helpers';
import { RegistreringTagType, registreringApi } from '@app/redux/api/registreringer/registrering';
import { DraftRegistrering, FinishedRegistrering, Registrering } from '@app/redux/api/registreringer/types';

export const queriesSlice = registreringApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getFerdigeRegistreringer: builder.query<FinishedRegistrering[], void>({
      query: () => `/registreringer/ferdige?sidenDager=30`,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        for (const registrering of data) {
          dispatch(queriesSlice.util.upsertQueryData('getRegistrering', registrering.id, registrering));
        }
      },
    }),

    getUferdigeRegistreringer: builder.query<DraftRegistrering[], void>({
      query: () => `/registreringer/uferdige`,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        for (const registrering of data) {
          dispatch(queriesSlice.util.upsertQueryData('getRegistrering', registrering.id, registrering));
        }
      },
    }),

    getRegistrering: builder.query<Registrering, string>({
      query: (id) => `/registreringer/${id}`,
      providesTags: (_, __, id) => [{ id, type: RegistreringTagType.REGISTRERING }],
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
