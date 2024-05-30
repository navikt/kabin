import { IAddress, IPart, skipToken } from '@app/types/common';
import { HandlingEnum } from '@app/types/create';
import { IArkivertDocument } from '@app/types/dokument';
import { IAnkeMulighet, IKlagemulighet } from '@app/types/mulighet';
import { IValidationSection } from '@app/types/validation';

export enum Type {
  NONE = 'NONE',
  ANKE = 'ANKE',
  KLAGE = 'KLAGE',
}

interface ICommonOverstyringer {
  fristInWeeks: number; // Number of weeks
  fullmektig: IPart | null;
  klager: IPart | null;
  mottattKlageinstans: string | null; // LocalDate
  avsender: IPart | null;
  ytelseId: string | null;
  hjemmelIdList: string[];
  saksbehandlerIdent: string | null;
}

interface IKlageOverstyringer extends ICommonOverstyringer {
  mottattVedtaksinstans: string | null; // LocalDate
}

export interface IKlageStateUpdate {
  mulighet?: IKlagemulighet | null;
  overstyringer?: Partial<IKlageOverstyringer>;
}

export interface IKlageState extends IKlageStateUpdate {
  mulighet: IKlagemulighet | null;
  overstyringer: IKlageOverstyringer;
}

export type IAnkeOverstyringer = ICommonOverstyringer;

export interface Recipient {
  part: IPart;
  handling: HandlingEnum;
  overriddenAddress: IAddress | null;
}

export interface Svarbrev {
  title: string;
  receivers: Recipient[];
  fullmektigFritekst: string | null;
}

export interface ValidSvarbrev {
  title: string;
  receivers: Recipient[];
  fullmektigFritekst: string | null;
}

export interface IAnkeStateUpdate {
  mulighet?: IAnkeMulighet | null;
  overstyringer?: Partial<IAnkeOverstyringer>;
  sendSvarbrev?: boolean;
  svarbrev?: Partial<Svarbrev>;
}

export interface IAnkeState extends IAnkeStateUpdate {
  mulighet: IAnkeMulighet | null;
  overstyringer: IAnkeOverstyringer;
  sendSvarbrev: boolean;
  svarbrev: Svarbrev;
}

type StateFn<P, S> = (p: S) => P;
export type State<P, S> = P | StateFn<P, S>;
export type UpdateFn<P, S> = (p: State<P, S>) => void;

export type UpdateErrorsFn = (errors: IValidationSection[] | null) => IValidationSection[] | null;

interface IBaseContext<
  P extends IKlageStateUpdate | IAnkeStateUpdate | null,
  S extends IKlageState | IAnkeState | null,
> {
  type: Type;
  setType: React.Dispatch<React.SetStateAction<Type>>;
  errors: IValidationSection[] | null;
  setErrors: (errors: IValidationSection[] | null | UpdateErrorsFn) => void;
  journalpost: IArkivertDocument | null;
  setJournalpost: React.Dispatch<React.SetStateAction<IArkivertDocument | null>>;
  fnr: string | typeof skipToken;
  state: S;
  updateState: UpdateFn<P, S>;
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

export type IAppContext = INoneContext | IKlageContext | IAnkeContext;

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

export const DEFAULT_SVARBREV_NAME = 'NAV orienterer om saksbehandlingen';

export const INITIAL_ANKE: IAnkeState = {
  mulighet: null,
  overstyringer: {
    fristInWeeks: 12,
    fullmektig: null,
    klager: null,
    mottattKlageinstans: null,
    avsender: null,
    ytelseId: null,
    hjemmelIdList: [],
    saksbehandlerIdent: null,
  },
  sendSvarbrev: true,
  svarbrev: {
    fullmektigFritekst: null,
    receivers: [],
    title: DEFAULT_SVARBREV_NAME,
  },
};
