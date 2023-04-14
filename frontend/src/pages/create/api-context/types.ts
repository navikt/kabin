import { IValidationSection } from '@app/components/footer/error-type-guard';
import { IPart, skipToken } from '@app/types/common';
import { IArkivertDocument } from '@app/types/dokument';
import { IAnkeMulighet, IKlagemulighet } from '@app/types/mulighet';

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
}

export interface IKlageState {
  mulighet: IKlagemulighet | null;
  overstyringer: IKlageOverstyringer;
}

interface IAnkeOverstyringer {
  fristInWeeks: number; // Number of weeks
  fullmektig: IPart | null;
  klager: IPart | null;
  mottattKlageinstans: string | null; // LocalDate
  avsender: IPart | null;
}

export interface IAnkeState {
  mulighet: IAnkeMulighet | null;
  overstyringer: IAnkeOverstyringer;
}

type PayloadFn<T> = (p: T) => DeepPartial<T>;
export type Payload<T> = DeepPartial<T> | PayloadFn<T>;
export type UpdateFn<T> = (p: Payload<T>) => void;

interface IBaseContext<T> {
  type: Type;
  setType: React.Dispatch<React.SetStateAction<Type>>;
  errors: IValidationSection[] | null;
  setErrors: (errors: IValidationSection[] | null) => void;
  journalpost: IArkivertDocument | null;
  setJournalpost: React.Dispatch<React.SetStateAction<IArkivertDocument | null>>;
  fnr: string | typeof skipToken;

  payload: T;
  updatePayload: UpdateFn<T>;
}

interface INoneContext extends IBaseContext<null> {
  type: Type.NONE;
  // payload: null;
  // updatePayload: UpdateFn<null>;
}

interface IKlageContext extends IBaseContext<IKlageState> {
  type: Type.KLAGE;
  // payload: IKlageState;
  // updatePayload: UpdateFn<IKlageState>;
}

interface IAnkeContext extends IBaseContext<IAnkeState> {
  type: Type.ANKE;
  // payload: IAnkeState;
  // updatePayload: UpdateFn<IAnkeState>;
}

export type IApiContext = INoneContext | IKlageContext | IAnkeContext;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
