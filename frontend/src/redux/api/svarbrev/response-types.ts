import { Receiver } from '@app/redux/api/registreringer/types';
import { SvarbrevResponse } from '@app/redux/api/types';
import { BehandlingstidUnitType } from '@app/types/calculate-frist';

export type SetSvarbrevSendResponse = SvarbrevResponse<{ send: boolean }>;

export type SetSvarbrevBehandlingstidResponse = SvarbrevResponse<{
  behandlingstid: { units: number; unitTypeId: BehandlingstidUnitType };
  calculatedFrist: string;
}>;

export type SetSvarbrevFullmektigFritekst = SvarbrevResponse<{ fullmektigFritekst: string }>;

export type SetSvarbrevOverrideBehandlingstidResponse = SvarbrevResponse<{
  overrideBehandlingstid: boolean;
  behandlingstid: { units: number; unitTypeId: BehandlingstidUnitType };
  calculatedFrist: string;
}>;

export type SetOverrideCustomTextResponse = SvarbrevResponse<{ overrideCustomText: boolean }>;

export type SetSvarbrevTitleResponse = SvarbrevResponse<{ title: string }>;

export type SetSvarbrevCustomTextResponse = SvarbrevResponse<{ customText: string }>;

export type ReceiverResponse = SvarbrevResponse<{ receivers: Receiver[] }>;
