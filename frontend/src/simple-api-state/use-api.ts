import { IAnkeMulighet } from '@app/types/ankemulighet';
import { ISignatureResponse, IUserData } from '@app/types/bruker';
import { IPart, SaksTypeEnum, skipToken } from '@app/types/common';
import { IArkivertDocument } from '@app/types/dokument';
import { IStatus } from '@app/types/status';
import { IKlagemulighet } from './../types/klagemulighet';
import { SimpleApiState, useSimpleApiState } from './simple-api-state';
import { getStateFactory } from './state-factory';

const INNSTILLINGER_BASE_PATH = '/api/kabal-innstillinger';
export const KABIN_API_BASE_PATH = '/api/kabin-api';

const userState = new SimpleApiState<IUserData>(`${INNSTILLINGER_BASE_PATH}/me/brukerdata`);
export const useUser = () => useSimpleApiState(userState);

const signatureState = new SimpleApiState<ISignatureResponse>(`${INNSTILLINGER_BASE_PATH}/me/signature`);
export const useSignature = () => useSimpleApiState(signatureState);

interface IDokumenterResponse {
  dokumenter: IArkivertDocument[];
  pageReference: string | null;
  antall: number;
  totaltAntall: number;
}

interface IdParams {
  idnr: string;
}

const getDokumenterState = getStateFactory<IDokumenterResponse, IdParams>(
  `${KABIN_API_BASE_PATH}/arkivertedokumenter?antall=50000`,
  { method: 'POST' }
);

export const useDokumenter = (idnummer: string | typeof skipToken) =>
  useSimpleApiState(idnummer === skipToken ? skipToken : getDokumenterState({ path: '' }, { idnummer }));

const getAnkemuligheterState = getStateFactory<IAnkeMulighet[], IdParams>(
  `${KABIN_API_BASE_PATH}/ankemuligheter?antall=50000`,
  { method: 'POST' }
);

export const useAnkemuligheter = (idnummer: string | typeof skipToken) =>
  useSimpleApiState(idnummer === skipToken ? skipToken : getAnkemuligheterState({ path: '' }, { idnummer }));

const getKlagemuligheterState = getStateFactory<IKlagemulighet[], IdParams>(
  `${KABIN_API_BASE_PATH}/klagemuligheter?antall=50000`,
  { method: 'POST' }
);

export const useKlagemuligheter = (idnummer: string | typeof skipToken) =>
  useSimpleApiState(idnummer === skipToken ? skipToken : getKlagemuligheterState({ path: '' }, { idnummer }));

interface SearchPartParams {
  identifikator: string;
}

const getSearchState = getStateFactory<IPart, SearchPartParams>(`${KABIN_API_BASE_PATH}/searchpart`, {
  method: 'POST',
});

export const useSearchPart = (identifikator: string | typeof skipToken) =>
  useSimpleApiState(identifikator === skipToken ? skipToken : getSearchState({ path: '' }, { identifikator }));

interface StatusParams {
  id: string;
  type: SaksTypeEnum;
}

const getStatusState = getStateFactory<IStatus, void>(KABIN_API_BASE_PATH, { method: 'GET' });

export const useStatus = (params: StatusParams | typeof skipToken) => {
  const state = params === skipToken ? skipToken : getStatusState({ path: getPath(params) });

  return useSimpleApiState(state);
};

const getPath = ({ type, id }: StatusParams) => {
  switch (type) {
    case SaksTypeEnum.ANKE:
      return `/anker/${id}/status`;
    case SaksTypeEnum.KLAGE:
      return `/klager/${id}/status`;
  }
};

interface CalculateFristdatoParams {
  fromDate: string; // LocalDate
  fristInWeeks: number;
}

const calculateFristdatoState = getStateFactory<string, CalculateFristdatoParams>(
  `${KABIN_API_BASE_PATH}/calculatefrist`,
  { method: 'POST' }
);

export const useCalculateFristdato = (params: CalculateFristdatoParams | typeof skipToken) =>
  useSimpleApiState(
    params === skipToken
      ? skipToken
      : calculateFristdatoState({ path: '' }, { fromDate: params.fromDate, fristInWeeks: params.fristInWeeks })
  );
