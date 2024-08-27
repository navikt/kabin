import { Behandlingstid } from '@app/redux/api/registreringer/types';

export interface SetMottattVedtaksintansParams {
  id: string;
  mottattVedtaksinstans: string;
}

export interface SetMottattKlageinstansParams {
  id: string;
  mottattKlageinstans: string;
}

export interface SetBehandlingstidParams extends Behandlingstid {
  id: string;
}

export interface SetHjemmelIdListParams {
  id: string;
  hjemmelIdList: string[];
}

export interface SetYtelseParams {
  id: string;
  ytelseId: string;
}

export interface SetSaksbehandlerIdentParams {
  id: string;
  saksbehandlerIdent: string | null;
}

export interface SetOppgaveIdParams {
  id: string;
  oppgaveId: number | null;
}
