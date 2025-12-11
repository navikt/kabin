import type { AvsenderMottakerType, IdType } from '@app/types/common';

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
  logiskeVedlegg: LogiskVedlegg[];
  varianter: Variants;
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

export interface LogiskVedlegg {
  tittel: string;
  logiskVedleggId: string;
}

export interface IJournalpostAvsenderMottaker {
  id: string;
  name: string | null;
  type: AvsenderMottakerType | IdType;
}

export interface IArkivertDocument {
  /** Unik identifikator per journalpost. */
  journalpostId: string;
  dokumentInfoId: string;
  /** Beskriver innholdet i journalposten samlet, f.eks. "Ettersendelse til søknad om foreldrepenger" */
  tittel: string | null;
  temaId: string | null;
  /** Datoen journalposten ble opprettet i arkivet. Datoen settes automatisk og kan ikke overskrives. Selv om hver journalpost har mange datoer (se Type: RelevantDato) er datoOpprettet å anse som "fasit" på journalpostens alder. */
  datoOpprettet: string;
  /** Om bruker har tilgang til å se dokumentet. */
  harTilgangTilArkivvariant: boolean;
  vedlegg: IVedlegg[];
  /** Sier hvorvidt journalposten er et inngående dokument, et utgående dokument eller et notat. */
  journalposttype: JournalposttypeEnum;
  /** Status på journalposten i joark, f.eks. MOTTATT eller JOURNALFØRT. Journalstatusen gir et indikasjon på hvor i journalførings- eller dokumentproduksjonsprosessen journalposten befinner seg. Journalposter som er resultat av en feilsituasjon og ikke skal hensyntas for saksbehandling har egne koder, som UTGAAR eller AVBRUTT.  */
  journalstatus: Journalstatus;
  behandlingstema: string | null;
  behandlingstemanavn: string | null;
  sak: ISak | null;
  /** Personen eller organisasjonen som er avsender eller mottaker av dokumentene i journalposten. */
  avsenderMottaker: IJournalpostAvsenderMottaker | null;
  /** Nav-enheten som har journalført forsendelsen. I noen tilfeller brukes journalfEnhet til å rute journalføringsoppgaven til korrekt enhet i Nav. I slike tilfeller vil journalfEnhet være satt også for ikke-journalførte dokumenter. */
  journalfoerendeEnhet: string | null;
  /** Personen eller systembrukeren i Nav som har journalført forsendelsen. Bruken av feltet varierer, og kan inneholde den ansattes navn eller Nav-ident. Dersom forsendelsen er automatisk journalført, kan innholdet være f.eks. en servicebruker eller et batchnavn. */
  journalfortAvNavn: string | null;
  /** Personen eller systembrukeren i Nav som har opprettet journalposten. Bruken av feltet varierer, og kan inneholde den ansattes navn eller Nav-ident. For inngående dokumenter kan innholdet være f.eks. en servicebruker eller et batchnavn. */
  opprettetAvNavn: string | null;
  relevanteDatoer: IRelerendeDato[];
  /** Antall ganger brevet har vært forsøkt sendt til bruker og deretter kommet i retur til Nav. Vil kun være satt for utgående forsendelser. */
  antallRetur: number | null;
  /** Liste over fagspesifikke metadata som er tilknyttet journalpost. */
  tilleggsopplysninger: ITilleggsopplysning[];
  /** Kanalen dokumentene ble mottatt i eller sendt ut på f.eks. "SENTRAL_UTSKRIFT" eller "ALTINN". Dersom journalposten ikke har noen kjent kanal, returneres verdien "UKJENT". */
  kanal: Kanal | null;
  /** Dekode av Enum: Kanal, f.eks "Sentral utskrift" */
  kanalnavn: string | null;
  /** Utsendingsinfo tilknyttet journalposten. Beskriver hvor forsendelsen er distribuert, eller hvor varsel er sendt. Settes kun for utgående journalposter. */
  utsendingsinfo: IUtsendingsinfo | null;
  alreadyUsed: boolean;
  logiskeVedlegg: LogiskVedlegg[];
  varianter: Variants;
  hasAccess: boolean;
  canChangeAvsender: boolean;
}

interface Variant {
  /** Filtype for dokumentvarianten. */
  filtype: Filtype;
  hasAccess: boolean;
  format: VariantFormat;
  skjerming: Skjerming | null;
}

export type Variants = [Variant, Variant] | [Variant];

export enum VariantFormat {
  ARKIV = 'ARKIV',
  SLADDET = 'SLADDET',
}

export enum Skjerming {
  POL = 'POL',
  FEIL = 'FEIL',
}

export enum Filtype {
  PDF = 'PDF',
  JPEG = 'JPEG',
  PNG = 'PNG',
  TIFF = 'TIFF',
  XLSX = 'XLSX',
  JSON = 'JSON',
  XML = 'XML',
  AXML = 'AXML',
  DXML = 'DXML',
  RTF = 'RTF',
}
