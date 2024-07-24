export const skipToken = Symbol('skipToken');

export enum Utsendingskanal {
  SENTRAL_UTSKRIFT = 'SENTRAL_UTSKRIFT',
  SDP = 'SDP',
  NAV_NO = 'NAV_NO',
  LOKAL_UTSKRIFT = 'LOKAL_UTSKRIFT',
  INGEN_DISTRIBUSJON = 'INGEN_DISTRIBUSJON',
  TRYGDERETTEN = 'TRYGDERETTEN',
  DPVT = 'DPVT',
}

export const UTSENDINGSKANAL: Record<Utsendingskanal, string> = {
  [Utsendingskanal.SENTRAL_UTSKRIFT]: 'Sentral utskrift',
  [Utsendingskanal.SDP]: 'Digital Postkasse Innbygger',
  [Utsendingskanal.NAV_NO]: 'Nav.no',
  [Utsendingskanal.LOKAL_UTSKRIFT]: 'Lokal utskrift',
  [Utsendingskanal.INGEN_DISTRIBUSJON]: 'Ingen distribusjon',
  [Utsendingskanal.TRYGDERETTEN]: 'Trygderetten',
  [Utsendingskanal.DPVT]: 'Taushetsbelagt digital post til virksomhet',
};

interface BaseAddress {
  adresselinje2: string | null;
  adresselinje3: string | null;
}

interface NorwegianAddress extends BaseAddress {
  adresselinje1: string | null;
  postnummer: string;
  landkode: 'NO';
}

interface ForeignAddress extends BaseAddress {
  adresselinje1: string;
  postnummer: string | null;
  landkode: string;
}

export type IAddress = NorwegianAddress | ForeignAddress;

export const isNorwegianAddress = (address: IAddress): address is NorwegianAddress => address.landkode === 'NO';

interface IPartBase {
  id: string;
  name: string | null;
  available: boolean;
  language: string;
  address: IAddress | null;
  utsendingskanal: Utsendingskanal;
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
  DELT_ANSVAR = 'DELT_ANSVAR',
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

export type IOrganizationStatus =
  | {
      status: PartStatusEnum.DELETED;
      date: string;
    }
  | {
      status: PartStatusEnum.DELT_ANSVAR;
      date: null;
    };

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

export type ISimplePart = Omit<IPart, 'address' | 'utsendingskanal' | 'language'>;

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

export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}
