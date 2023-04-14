import { IAvsenderMottaker } from '@app/types/common';

export enum JournalposttypeEnum {
  INNGAAENDE = 'I',
  UTGAAENDE = 'U',
  NOTAT = 'N',
}

enum Journalstatus {
  MOTTATT = 'MOTTATT',
  JOURNALFOERT = 'JOURNALFOERT',
  FERDIGSTILT = 'FERDIGSTILT',
  EKSPEDERT = 'EKSPEDERT',
  UNDER_ARBEID = 'UNDER_ARBEID',
  FEILREGISTRERT = 'FEILREGISTRERT',
  UTGAAR = 'UTGAAR',
  AVBRUTT = 'AVBRUTT',
  UKJENT_BRUKER = 'UKJENT_BRUKER',
  RESERVERT = 'RESERVERT',
  OPPLASTING_DOKUMENT = 'OPPLASTING_DOKUMENT',
  UKJENT = 'UKJENT',
}

export interface IVedlegg {
  dokumentInfoId: string;
  tittel: string | null;
  harTilgangTilArkivvariant: boolean;
}

export interface ISak {
  datoOpprettet: string;
  fagsakId: string;
  fagsystemId: string;
}

enum Datotype {
  DATO_SENDT_PRINT = 'DATO_SENDT_PRINT',
  DATO_EKSPEDERT = 'DATO_EKSPEDERT',
  DATO_JOURNALFOERT = 'DATO_JOURNALFOERT',
  DATO_REGISTRERT = 'DATO_REGISTRERT',
  DATO_AVS_RETUR = 'DATO_AVS_RETUR',
  DATO_DOKUMENT = 'DATO_DOKUMENT',
  DATO_LEST = 'DATO_LEST',
}

interface IRelerendeDato {
  dato: string;
  datotype: Datotype;
}

interface ITilleggsopplysning {
  key: string;
  value: string;
}

enum Kanal {
  ALTINN = 'ALTINN',
  EIA = 'EIA',
  NAV_NO = 'NAV_NO',
  NAV_NO_UINNLOGGET = 'NAV_NO_UINNLOGGET',
  NAV_NO_CHAT = 'NAV_NO_CHAT',
  SKAN_NETS = 'SKAN_NETS',
  SKAN_PEN = 'SKAN_PEN',
  SKAN_IM = 'SKAN_IM',
  INNSENDT_NAV_ANSATT = 'INNSENDT_NAV_ANSATT',
  EESSI = 'EESSI',
  EKST_OPPS = 'EKST_OPPS',
  SENTRAL_UTSKRIFT = 'SENTRAL_UTSKRIFT',
  LOKAL_UTSKRIFT = 'LOKAL_UTSKRIFT',
  SDP = 'SDP',
  TRYGDERETTEN = 'TRYGDERETTEN',
  HELSENETTET = 'HELSENETTET',
  INGEN_DISTRIBUSJON = 'INGEN_DISTRIBUSJON',
  DPV = 'DPV',
  DPVS = 'DPVS',
  UKJENT = 'UKJENT',
}

interface IEpostVarselSendt {
  tittel: string;
  adresse: string;
  varslingstekst: string;
}

interface ISmsVarselSendt {
  adresse: string;
  varslingstekst: string;
}

interface IFysiskpostSendt {
  adressetekstKonvolutt: string;
}

interface IDigitalpostSendt {
  adresse: string;
}

interface IUtsendingsinfo {
  epostVarselSendt: IEpostVarselSendt;
  smsVarselSendt: ISmsVarselSendt;
  fysiskpostSendt: IFysiskpostSendt;
  digitalpostSendt: IDigitalpostSendt;
}

export interface IArkivertDocument {
  journalpostId: string;
  dokumentInfoId: string;
  tittel: string | null;
  temaId: string | null;
  registrert: string;
  harTilgangTilArkivvariant: boolean;
  vedlegg: IVedlegg[];
  journalposttype: JournalposttypeEnum;
  journalstatus: Journalstatus;
  behandlingstema: string | null;
  behandlingstemanavn: string | null;
  sak: ISak | null;
  avsenderMottaker: IAvsenderMottaker | null;
  journalfoerendeEnhet: string | null;
  journalfortAvNavn: string | null;
  opprettetAvNavn: string | null;
  datoOpprettet: string;
  relevanteDatoer: IRelerendeDato[];
  antallRetur: number | null;
  tilleggsopplysninger: ITilleggsopplysning[];
  kanal: Kanal | null;
  kanalnavn: string | null;
  utsendingsinfo: IUtsendingsinfo | null;
  alreadyUsed: boolean;
}
