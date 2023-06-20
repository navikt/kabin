import { ISignatureResponse, IUserData } from '@app/types/bruker';
import { IPart, ISaksbehandler, SaksTypeEnum, skipToken } from '@app/types/common';
import { IArkivertDocument } from '@app/types/dokument';
import { IAnkeMulighet, IKlagemulighet } from '@app/types/mulighet';
import { IAnkestatus, IKlagestatus } from '@app/types/status';
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
  { method: 'POST', cacheTime: 0 }
);

export const useDokumenter = (idnummer: string | typeof skipToken) =>
  useSimpleApiState(idnummer === skipToken ? skipToken : getDokumenterState({ path: '' }, { idnummer }));

const getAnkemuligheterState = getStateFactory<IAnkeMulighet[], IdParams>(
  `${KABIN_API_BASE_PATH}/ankemuligheter?antall=50000`,
  { method: 'POST', cacheTime: 0 }
);

export const useAnkemuligheter = (idnummer: string | typeof skipToken) =>
  useSimpleApiState(idnummer === skipToken ? skipToken : getAnkemuligheterState({ path: '' }, { idnummer }));

const getKlagemuligheterState = getStateFactory<IKlagemulighet[], IdParams>(
  `${KABIN_API_BASE_PATH}/klagemuligheter?antall=50000`,
  { method: 'POST', cacheTime: 0 }
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

const getAnkeStatusState = getStateFactory<IAnkestatus, void>(KABIN_API_BASE_PATH, { method: 'GET' });
const getKlageStatusState = getStateFactory<IKlagestatus, void>(KABIN_API_BASE_PATH, { method: 'GET' });

export const useAnkeStatus = (params: StatusParams | typeof skipToken) => {
  const state = params === skipToken ? skipToken : getAnkeStatusState({ path: getPath(params) });

  return useSimpleApiState(state);
};

export const useKlageStatus = (params: StatusParams | typeof skipToken) => {
  const state = params === skipToken ? skipToken : getKlageStatusState({ path: getPath(params) });

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
  { method: 'POST', cacheTime: 300_000 }
);

export const useCalculateFristdato = (params: CalculateFristdatoParams | typeof skipToken) =>
  useSimpleApiState(
    params === skipToken
      ? skipToken
      : calculateFristdatoState({ path: '' }, { fromDate: params.fromDate, fristInWeeks: params.fristInWeeks })
  );

interface ISaksbehandlereResponse {
  saksbehandlere: ISaksbehandler[];
}

export interface ISaksbehandlerParams extends Record<string, unknown> {
  ytelseId: string;
  fnr: string;
}

const saksbehandlereState = getStateFactory<ISaksbehandlereResponse, void>(
  `${INNSTILLINGER_BASE_PATH}/search/saksbehandlere`,
  { method: 'POST' }
);

export const useSaksbehandlere = (params: ISaksbehandlerParams | typeof skipToken) =>
  useSimpleApiState(params === skipToken ? skipToken : saksbehandlereState({ path: '' }, params));
