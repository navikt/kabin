import { IKodeverkSimpleValue, IKodeverkValue, UtfallEnum } from '../types/kodeverk';
import { SimpleApiState, useSimpleApiState } from './simple-api-state';

const API_PREFIX = '/api/klage-kodeverk-api/kodeverk';

const ytelserSimple = new SimpleApiState<IKodeverkSimpleValue[]>(`${API_PREFIX}/ytelser/simple`);
const utfall = new SimpleApiState<IKodeverkSimpleValue<UtfallEnum>[]>(`${API_PREFIX}/utfall`);
const tema = new SimpleApiState<IKodeverkValue[]>(`${API_PREFIX}/tema`);

export const useSimpleYtelser = () => useSimpleApiState(ytelserSimple);
export const useUtfall = () => useSimpleApiState(utfall);
export const useTema = () => useSimpleApiState(tema);
