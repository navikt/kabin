import { createApi } from '@reduxjs/toolkit/query/react';
import { API_BASE_QUERY } from '@app/redux/api/common';
import { KABIN_API_BASE_PATH } from '@app/simple-api-state/use-api';
import { SaksTypeEnum } from '@app/types/common';
import { IAnkemulighet, IKlagemulighet } from '@app/types/mulighet';

export const muligheterApi = createApi({
  reducerPath: 'muligheterApi',
  baseQuery: API_BASE_QUERY,
  endpoints: (builder) => ({
    getAnkemuligheter: builder.query<IAnkemulighet[], string>({
      query: (idnummer) => ({
        url: `${KABIN_API_BASE_PATH}/ankemuligheter?antall=50000`,
        method: 'POST',
        body: { idnummer },
      }),
    }),
    getKlagemuligheter: builder.query<IKlagemulighet[], string>({
      query: (idnummer) => ({
        url: `${KABIN_API_BASE_PATH}/klagemuligheter?antall=50000`,
        method: 'POST',
        body: { idnummer },
      }),
    }),
    getMulighet: builder.query<IAnkemulighet | IKlagemulighet, { id: string; typeId: SaksTypeEnum }>({
      query: ({ id, typeId }) => `${KABIN_API_BASE_PATH}/registreringer/${id}/${getPath(typeId)}`,
    }),
    getKlagemulighet: builder.query<IKlagemulighet, string>({
      query: (id) => `${KABIN_API_BASE_PATH}/registreringer/${id}/klagemulighet`,
    }),
    getAnkemulighet: builder.query<IAnkemulighet, string>({
      query: (id) => `${KABIN_API_BASE_PATH}/registreringer/${id}/ankemulighet`,
    }),
  }),
});

const getPath = (typeId: SaksTypeEnum) => {
  switch (typeId) {
    case SaksTypeEnum.ANKE:
      return 'ankemulighet';
    case SaksTypeEnum.KLAGE:
      return 'klagemulighet';
  }
};

export const {
  useGetAnkemuligheterQuery,
  useGetKlagemuligheterQuery,
  useGetMulighetQuery,
  useGetAnkemulighetQuery,
  useGetKlagemulighetQuery,
} = muligheterApi;
