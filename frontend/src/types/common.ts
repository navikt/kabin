export const skipToken = Symbol('skipToken');

export enum PartType {
  FNR = 'FNR',
  ORGNR = 'ORGNR',
}

export const PART_TYPES = Object.values(PartType);

export enum AvsenderMottakerType {
  HPRNR = 'HPRNR',
  UTL_ORG = 'UTL_ORG',
  UKJENT = 'UKJENT',
  NULL = 'NULL',
}

export interface IAvsenderMottaker {
  type: AvsenderMottakerType | PartType;
  id: string;
  name: string | null;
}

export interface IPart extends IAvsenderMottaker {
  type: PartType;
}

export interface IPartId {
  type: PartType;
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
