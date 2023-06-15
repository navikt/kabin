import { IPart, skipToken } from '@app/types/common';
import { IArkivertDocument } from '@app/types/dokument';
import { IAnkeMulighet, IKlagemulighet } from '@app/types/mulighet';
import { IValidationSection } from '@app/types/validation';

export enum Type {
  NONE = 'NONE',
  ANKE = 'ANKE',
  KLAGE = 'KLAGE',
}

interface IKlageOverstyringer {
  fristInWeeks: number; // Number of weeks
  fullmektig: IPart | null;
  klager: IPart | null;
  mottattVedtaksinstans: string | null; // LocalDate
  mottattKlageinstans: string | null; // LocalDate
  avsender: IPart | null;
  ytelseId: string | null;
  hjemmelIdList: string[];
  saksbehandlerIdent: string | null;
}

export interface IKlageState extends IKlageStateUpdate {
  mulighet: IKlagemulighet | null;
  overstyringer: IKlageOverstyringer;
}

interface IAnkeOverstyringer {
  fristInWeeks: number; // Number of weeks
  fullmektig: IPart | null;
  klager: IPart | null;
  mottattKlageinstans: string | null; // LocalDate
  avsender: IPart | null;
  saksbehandlerIdent: string | null;
}

export interface IAnkeState extends IAnkeStateUpdate {
  mulighet: IAnkeMulighet | null;
  overstyringer: IAnkeOverstyringer;
}

export interface IKlageStateUpdate {
  mulighet?: IKlagemulighet | null;
  overstyringer?: Partial<IKlageOverstyringer>;
}

export interface IAnkeStateUpdate {
  mulighet?: IAnkeMulighet | null;
  overstyringer?: Partial<IAnkeOverstyringer>;
}

type PayloadFn<P, S> = (p: S) => P;
export type Payload<P, S> = P | PayloadFn<P, S>;
export type UpdateFn<P, S> = (p: Payload<P, S>) => void;

interface IBaseContext<
  P extends IKlageStateUpdate | IAnkeStateUpdate | null,
  S extends IKlageState | IAnkeState | null
> {
  type: Type;
  setType: React.Dispatch<React.SetStateAction<Type>>;
  errors: IValidationSection[] | null;
  setErrors: (errors: IValidationSection[] | null) => void;
  journalpost: IArkivertDocument | null;
  setJournalpost: React.Dispatch<React.SetStateAction<IArkivertDocument | null>>;
  fnr: string | typeof skipToken;
  payload: S;
  updatePayload: UpdateFn<P, S>;
}

interface INoneContext extends IBaseContext<null, null> {
  type: Type.NONE;
}

interface IKlageContext extends IBaseContext<IKlageStateUpdate, IKlageState> {
  type: Type.KLAGE;
}

interface IAnkeContext extends IBaseContext<IAnkeStateUpdate, IAnkeState> {
  type: Type.ANKE;
}

export type IApiContext = INoneContext | IKlageContext | IAnkeContext;

export const INITIAL_KLAGE: IKlageState = {
  mulighet: null,
  overstyringer: {
    mottattVedtaksinstans: null,
    mottattKlageinstans: null,
    hjemmelIdList: [],
    ytelseId: null,
    fristInWeeks: 12,
    fullmektig: null,
    klager: null,
    avsender: null,
    saksbehandlerIdent: null,
  },
};

export const INITIAL_ANKE: IAnkeState = {
  mulighet: null,
  overstyringer: {
    fristInWeeks: 12,
    fullmektig: null,
    klager: null,
    mottattKlageinstans: null,
    avsender: null,
    saksbehandlerIdent: null,
  },
};
