import { IBehandling } from '../types/behandling';
import { ISignatureResponse, IUserData } from '../types/bruker';
import { IPart, SaksTypeEnum, skipToken } from '../types/common';
import { IArkivertDocument } from '../types/dokument';
import { IStatus } from '../types/status';
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
  `${KABIN_API_BASE_PATH}/arkivertedokumenter`,
  { method: 'POST' }
);

export const useDokumenter = (idnummer: string | typeof skipToken) =>
  useSimpleApiState(idnummer === skipToken ? skipToken : getDokumenterState({ path: '' }, { idnummer }));

const getAnkemuligheterState = getStateFactory<IBehandling[], IdParams>(
  `${KABIN_API_BASE_PATH}/ankemuligheter?antall=50000`,
  { method: 'POST' }
);

export const useAnkemuligheter = (idnummer: string | typeof skipToken) =>
  useSimpleApiState(idnummer === skipToken ? skipToken : getAnkemuligheterState({ path: '' }, { idnummer }));

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

const getStatusState = getStateFactory<IStatus, void>(KABIN_API_BASE_PATH, {
  method: 'GET',
});

export const useStatus = (params: StatusParams | typeof skipToken) => {
  const state =
    params === skipToken
      ? skipToken
      : getStatusState({ path: `/${params.type === SaksTypeEnum.ANKE ? 'anker' : 'klager'}/${params.id}/status` });

  return useSimpleApiState(state);
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
