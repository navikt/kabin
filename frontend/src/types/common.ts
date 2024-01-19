export const skipToken = Symbol('skipToken');

interface IPartBase {
  id: string;
  name: string | null;
  available: boolean;
}

export enum IdType {
  FNR = 'FNR',
  ORGNR = 'ORGNR',
}

export enum PartStatusEnum {
  DEAD = 'DEAD',
  DELETED = 'DELETED',
  EGEN_ANSATT = 'EGEN_ANSATT',
  VERGEMAAL = 'VERGEMAAL',
  FULLMAKT = 'FULLMAKT',
  FORTROLIG = 'FORTROLIG',
  STRENGT_FORTROLIG = 'STRENGT_FORTROLIG',
  RESERVERT_I_KRR = 'RESERVERT_I_KRR',
}

export type IPersonStatus =
  | {
      status: PartStatusEnum.DEAD;
      date: string;
    }
  | {
      status: PartStatusEnum.EGEN_ANSATT;
      date: null;
    }
  | {
      status: PartStatusEnum.VERGEMAAL;
      date: null;
    }
  | {
      status: PartStatusEnum.FULLMAKT;
      date: null;
    }
  | {
      status: PartStatusEnum.FORTROLIG;
      date: null;
    }
  | {
      status: PartStatusEnum.STRENGT_FORTROLIG;
      date: null;
    }
  | {
      status: PartStatusEnum.RESERVERT_I_KRR;
      date: null;
    };

export interface IOrganizationStatus {
  status: PartStatusEnum.DELETED;
  date: string;
}

interface IPersonPart extends IPartBase {
  type: IdType.FNR;
  statusList: IPersonStatus[];
}

interface IOrganizationPart extends IPartBase {
  type: IdType.ORGNR;
  statusList: IOrganizationStatus[];
}

export enum AvsenderMottakerType {
  HPRNR = 'HPRNR',
  UTL_ORG = 'UTL_ORG',
  UKJENT = 'UKJENT',
  NULL = 'NULL',
}

export interface IAvsenderMottaker extends IPartBase {
  type: AvsenderMottakerType | IdType;
  statusList: IPersonStatus[] | IOrganizationStatus[];
}

export type IPart = IPersonPart | IOrganizationPart | IAvsenderMottaker;

export const PART_TYPES = Object.values(IdType);

export interface IPartId {
  type: IdType | AvsenderMottakerType;
  id: string;
}

export enum SaksTypeEnum {
  KLAGE = '1',
  ANKE = '2',
}

export interface ISaksbehandler {
  navIdent: string;
  navn: string;
}
