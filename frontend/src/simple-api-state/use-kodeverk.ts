import { skipToken } from '@app/types/common';
import { IKodeverkSimpleValue, IKodeverkValue, IYtelserLatest, UtfallEnum } from '@app/types/kodeverk';
import { SimpleApiState, useSimpleApiState } from './simple-api-state';
import { getStateFactory } from './state-factory';

const API_PREFIX = '/api/klage-kodeverk-api/kodeverk';

const ytelserSimple = new SimpleApiState<IKodeverkSimpleValue[]>(`${API_PREFIX}/ytelser/simple`);
const ytelseLatest = new SimpleApiState<IYtelserLatest[]>(`${API_PREFIX}/ytelser/latest`);
const utfall = new SimpleApiState<IKodeverkSimpleValue<UtfallEnum>[]>(`${API_PREFIX}/utfall`);
const tema = new SimpleApiState<IKodeverkValue[]>(`${API_PREFIX}/tema`);
const vedtaksenheter = new SimpleApiState<IKodeverkSimpleValue[]>(`${API_PREFIX}/vedtaksenheter`);
const klageenheter = new SimpleApiState<IKodeverkSimpleValue[]>(`${API_PREFIX}/klageenheter`);
const fagsystemer = new SimpleApiState<IKodeverkValue[]>(`${API_PREFIX}/fagsystemer`);

export const useSimpleYtelser = () => useSimpleApiState(ytelserSimple);
export const useLatestYtelser = () => useSimpleApiState(ytelseLatest);
export const useUtfall = () => useSimpleApiState(utfall);
export const useTema = () => useSimpleApiState(tema);
export const useVedtaksenheter = () => useSimpleApiState(vedtaksenheter);
export const useKlageenheter = () => useSimpleApiState(klageenheter);
export const useFagsystemer = () => useSimpleApiState(fagsystemer);

const temaYtelser = getStateFactory<IYtelserLatest[], string>(API_PREFIX);

export const useTemaYtelser = (temaId: string | typeof skipToken) => {
  const state = temaId === skipToken ? skipToken : temaYtelser({ path: `/tema/${temaId}/ytelser/latest` });

  return useSimpleApiState(state);
};
