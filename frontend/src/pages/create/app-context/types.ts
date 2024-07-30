import { skipToken } from '@reduxjs/toolkit/query/react';
import { BehandlingstidUnitType } from '@app/types/calculate-frist';
import { IAddress, IPart, SaksTypeEnum } from '@app/types/common';
import { IArkivertDocument } from '@app/types/dokument';
import { IAnkemulighet, IKlagemulighet } from '@app/types/mulighet';
import { HandlingEnum } from '@app/types/recipient';
import { IValidationSection } from '@app/types/validation';

export enum Type {
  NONE = 'NONE',
  ANKE = 'ANKE',
  KLAGE = 'KLAGE',
}

export const TYPE_TO_SAKSTYPE: Record<SaksTypeEnum.KLAGE | SaksTypeEnum.ANKE, SaksTypeEnum> = {
  [SaksTypeEnum.KLAGE]: SaksTypeEnum.KLAGE,
  [SaksTypeEnum.ANKE]: SaksTypeEnum.ANKE,
};

interface ICommonOverstyringer {
  fullmektig: IPart | null;
  klager: IPart | null;
  mottattKlageinstans: string | null; // LocalDate
  behandlingstidUnits: number;
  behandlingstidUnitTypeId: BehandlingstidUnitType;
  avsender: IPart | null;
  ytelseId: string | null;
  hjemmelIdList: string[];
  saksbehandlerIdent: string | null;
  oppgaveId: number | null;
}

export interface Svarbrev {
  title: string;
  varsletBehandlingstidUnits: number | null;
  varsletBehandlingstidUnitTypeId: BehandlingstidUnitType | null;
  customText: string | null;
  fullmektigFritekst: string | null;
  receivers: Recipient[];
}

export interface IKlageOverstyringer extends ICommonOverstyringer {
  mottattVedtaksinstans: string | null; // LocalDate
}

export interface IKlageStateUpdate {
  mulighet?: IKlagemulighet | null;
  overstyringer?: Partial<IKlageOverstyringer>;
}

export interface IKlageState extends IKlageStateUpdate {
  mulighet: IKlagemulighet | null;
  overstyringer: IKlageOverstyringer;
  sendSvarbrev: boolean;
  svarbrev: Svarbrev;
}

export type IAnkeOverstyringer = ICommonOverstyringer;

export interface Recipient {
  part: IPart;
  handling: HandlingEnum;
  overriddenAddress: IAddress | null;
}

export interface IKlageStateUpdate {
  mulighet?: IKlagemulighet | null;
  overstyringer?: Partial<IKlageOverstyringer>;
  sendSvarbrev?: boolean;
  svarbrev?: Partial<Svarbrev>;
}

export interface IAnkeStateUpdate {
  mulighet?: IAnkemulighet | null;
  overstyringer?: Partial<IAnkeOverstyringer>;
  sendSvarbrev?: boolean;
  svarbrev?: Partial<Svarbrev>;
}

export interface IAnkeState extends IAnkeStateUpdate {
  mulighet: IAnkemulighet | null;
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

export const DEFAULT_SVARBREV_NAME = 'NAV orienterer om saksbehandlingen';

export const INITIAL_KLAGE: IKlageState = {
  mulighet: null,
  overstyringer: {
    mottattVedtaksinstans: null,
    mottattKlageinstans: null,
    behandlingstidUnits: 12,
    behandlingstidUnitTypeId: BehandlingstidUnitType.WEEKS,
    hjemmelIdList: [],
    ytelseId: null,
    fullmektig: null,
    klager: null,
    avsender: null,
    saksbehandlerIdent: null,
    oppgaveId: null,
  },
  sendSvarbrev: true,
  svarbrev: {
    varsletBehandlingstidUnits: null,
    varsletBehandlingstidUnitTypeId: null,
    fullmektigFritekst: null,
    receivers: [],
    title: DEFAULT_SVARBREV_NAME,
    customText: null,
  },
};

export const INITIAL_ANKE: IAnkeState = {
  mulighet: null,
  overstyringer: {
    mottattKlageinstans: null,
    behandlingstidUnits: 12,
    behandlingstidUnitTypeId: BehandlingstidUnitType.WEEKS,
    hjemmelIdList: [],
    ytelseId: null,
    fullmektig: null,
    klager: null,
    avsender: null,
    saksbehandlerIdent: null,
    oppgaveId: null,
  },
  sendSvarbrev: true,
  svarbrev: {
    varsletBehandlingstidUnits: null,
    varsletBehandlingstidUnitTypeId: null,
    fullmektigFritekst: null,
    receivers: [],
    title: DEFAULT_SVARBREV_NAME,
    customText: null,
  },
};
