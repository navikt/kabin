import { skipToken } from '@reduxjs/toolkit/query/react';
import { Method, WillCreateNewJournalpostInput } from '@app/simple-api-state/types';
import { CalculateFristdatoParams } from '@app/types/calculate-frist';
import { ISaksbehandler, SaksTypeEnum } from '@app/types/common';
import { IGetOppgaverParams, IOppgave } from '@app/types/oppgave';
import { IAnkestatus, IKlagestatus } from '@app/types/status';
import { getStateFactory } from './state-factory';
import { useSimpleApiState } from './use-simple-api-state';

export const INNSTILLINGER_BASE_PATH = '/api/kabal-innstillinger';
export const KABAL_API_BASE_PATH = '/api/kabal-api';
export const KABIN_API_BASE_PATH = '/api/kabin-api';

interface StatusParams {
  id: string;
  type: SaksTypeEnum;
}

const getAnkeStatusState = getStateFactory<IAnkestatus, void>(KABIN_API_BASE_PATH, { method: Method.GET });
const getKlageStatusState = getStateFactory<IKlagestatus, void>(KABIN_API_BASE_PATH, { method: Method.GET });

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

const calculateFristdatoState = getStateFactory<string, CalculateFristdatoParams>(
  `${KABIN_API_BASE_PATH}/calculatefrist`,
  { method: Method.POST, cacheTime: 300_000 },
);

export const useCalculateFristdato = (params: CalculateFristdatoParams | typeof skipToken) =>
  useSimpleApiState(params === skipToken ? skipToken : calculateFristdatoState({ path: '' }, { ...params }));

interface ISaksbehandlereResponse {
  saksbehandlere: ISaksbehandler[];
}

export interface ISaksbehandlerParams extends Record<string, unknown> {
  ytelseId: string;
  fnr: string;
}

const saksbehandlereState = getStateFactory<ISaksbehandlereResponse, void>(
  `${INNSTILLINGER_BASE_PATH}/search/saksbehandlere`,
  { method: Method.POST },
);

export const useSaksbehandlere = (params: ISaksbehandlerParams | typeof skipToken) =>
  useSimpleApiState(params === skipToken ? skipToken : saksbehandlereState({ path: '' }, params));

const willCreateNewJournalpostState = getStateFactory<boolean>(`${KABIN_API_BASE_PATH}/willcreatenewjournalpost`, {
  method: Method.POST,
});

export const useWillCreateNewJournalpost = (params: WillCreateNewJournalpostInput | typeof skipToken) =>
  useSimpleApiState(params === skipToken ? skipToken : willCreateNewJournalpostState({}, { ...params }));

const getOppgaverState = getStateFactory<IOppgave[], IGetOppgaverParams>(`${KABIN_API_BASE_PATH}/searchoppgave`, {
  method: Method.POST,
});

export const useGetOppgaver = (params: IGetOppgaverParams | typeof skipToken) =>
  useSimpleApiState(params === skipToken ? skipToken : getOppgaverState({}, { ...params }));
