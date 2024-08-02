import { Behandlingstid, Overstyringer, Receiver } from '@app/redux/api/registreringer/types';
import { BaseResponse, OverstyringerResponse, SvarbrevResponse } from '@app/redux/api/types';
import { IPart } from '@app/types/common';

export type SetMottattKlageinstansResponse = OverstyringerResponse<{
  mottattKlageinstans: string;
  calculatedFrist: string;
}>;

export type SetMottattVedtaksintansResponse = OverstyringerResponse<{ mottattVedtaksinstans: string }>;

export type SetHjemmelIdListResponse = OverstyringerResponse<{ hjemmelIdList: string[] }>;

export type SetSaksbehandlerIdentResponse = OverstyringerResponse<{ saksbehandlerIdent: string | null }>;

export type SetOppgaveIdResponse = OverstyringerResponse<{ oppgaveId: number | null }>;

export type SetYtelseResponse = OverstyringerResponse<Pick<Overstyringer, 'ytelseId' | 'saksbehandlerIdent'>>;

export type SetFullmektigResponse = OverstyringerResponse<{ fullmektig: IPart }> &
  SvarbrevResponse<{ fullmektigFritekst: string; receivers: Receiver[] }>;

export type SetBehandlingstidResponse = OverstyringerResponse<{
  behandlingstid: Behandlingstid;
  calculatedFrist: string;
}>;

export type SetAvsenderResponse = OverstyringerResponse<{ avsender: IPart | null }> &
  SvarbrevResponse<{
    fullmektigFritekst: string;
    receivers: Receiver[];
  }>;

export interface SetKlagerResponse extends BaseResponse {
  klage: {
    klage: string;
    klageDato: string;
  };
}
