import { skipToken } from '@app/types/common';
import { IKodeverkSimpleValue, IKodeverkValue, IYtelserLatest } from '@app/types/kodeverk';
import { SimpleApiState } from './simple-api-state';
import { getStateFactory } from './state-factory';
import { useSimpleApiState } from './use-simple-api-state';

const API_PREFIX = '/api/klage-kodeverk-api/kodeverk';

const ytelserSimple = new SimpleApiState<IKodeverkSimpleValue[]>(`${API_PREFIX}/ytelser/simple`);
const ytelseLatest = new SimpleApiState<IYtelserLatest[]>(`${API_PREFIX}/ytelser/latest`);
const tema = new SimpleApiState<IKodeverkValue[]>(`${API_PREFIX}/tema`);
const vedtaksenheter = new SimpleApiState<IKodeverkSimpleValue[]>(`${API_PREFIX}/vedtaksenheter`);
const klageenheter = new SimpleApiState<IKodeverkSimpleValue[]>(`${API_PREFIX}/klageenheter`);
const innsendingsenheter = new SimpleApiState<IKodeverkSimpleValue[]>(`${API_PREFIX}/klageenheterforankeinnsending`);
const fagsystemer = new SimpleApiState<IKodeverkValue[]>(`${API_PREFIX}/fagsystemer`);
const hjemlerMap = new SimpleApiState<Record<string, string>>(`${API_PREFIX}/hjemlermap`);

export const useSimpleYtelser = () => useSimpleApiState(ytelserSimple);
export const useLatestYtelser = () => useSimpleApiState(ytelseLatest);
export const useTema = () => useSimpleApiState(tema);
export const useVedtaksenheter = () => useSimpleApiState(vedtaksenheter);
export const useKlageenheter = () => useSimpleApiState(klageenheter);
export const useInnsendingsenheter = () => useSimpleApiState(innsendingsenheter);
export const useFagsystemer = () => useSimpleApiState(fagsystemer);
export const useHjemlerMap = () => useSimpleApiState(hjemlerMap);

const temaYtelser = getStateFactory<IKodeverkSimpleValue[], string>(API_PREFIX);

export const useTemaYtelser = (temaId: string | typeof skipToken) => {
  const state = temaId === skipToken ? skipToken : temaYtelser({ path: `/tema/${temaId}/ytelser/latest` });

  return useSimpleApiState(state);
};
