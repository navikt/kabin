// /* eslint-disable max-lines */
// // POST /registreringer
// interface CreateRegistreringPayload {
//   fnr: string;
// }

// type CreateResponse = Registrering;

// // PUT /registreringer/{id}/journalpost-id
// interface UpdateJournalpostIdPayload {
//   journalpostId: string;
// }

// // PUT /registreringer/{id}/type-id
// interface UpdateTypeIdPayload {
//   typeId: Type;
// }

// // PUT /registreringer/{id}/mulighet
// type UpdateMulighetPayload = Mulighet;

// // PUT /registreringer/{id}/overstyringer/mottatt-vedtaksinstans
// interface UpdateMottattVedtaksinstansPayload {
//   mottattVedtaksinstans: string;
// }

// // PUT /registreringer/{id}/overstyringer/mottatt-klageinstans
// interface UpdateMottattKlageinstansPayload {
//   mottattKlageinstans: string;
// }

// // PUT /registreringer/{id}/overstyringer/behandlingstid
// type UpdateBehandlingstidPayload = Behandlingstid;

// // PUT /registreringer/{id}/overstyringer/hjemmel-id-list
// interface UpdateHjemmelIdPayload {
//   hjemmelIdList: string[];
// }

// // PUT /registreringer/{id}/overstyringer/ytelse-id
// interface UpdateYtelseIdPayload {
//   ytelseId: string;
// }

// // PUT /registreringer/{id}/overstyringer/fullmektig
// interface UpdatePartPayload {
//   id: string;
//   type: IdType.FNR;
// }

// interface PartResponse {
//   svarbrevReceivers: Recipient[]; // Bytte av fullmektig reflekteres.
// }

// // PUT /registreringer/{id}/overstyringer/klager
// interface UpdatePartPayload {
//   id: string;
//   type: IdType.FNR;
// }

// interface PartResponse {
//   svarbrevReceivers: Recipient[]; // Bytte av fullmektig reflekteres.
// }

// // PUT /registreringer/{id}/overstyringer/avsender
// interface UpdatePartPayload {
//   id: string;
//   type: IdType.FNR;
// }

// interface PartResponse {
//   svarbrevReceivers: Recipient[]; // Bytte av fullmektig reflekteres.
// }

// // PUT /registreringer/{id}/overstyringer/saksbehandler-ident
// interface UpdateSaksbehandlerIdentPayload {
//   saksbehandlerIdent: string;
// }

// // PUT /registreringer/{id}/overstyringer/oppgave-id
// interface UpdateOppgaveIdPayload {
//   oppgaveId: string;
// }

// // PUT /registreringer/{id}/svarbrev/send
// interface SendSvarbrevPayload {
//   send: boolean;
// }

// // PUT /registreringer/{id}/svarbrev/behandlingstid
// type UpdateSvarbrevBehandlingstidPayload = Behandlingstid;

// // PUT /registreringer/{id}/svarbrev/fullmektig-fritekst
// interface UpdateFullmektigFritekstPayload {
//   fullmektigFritekst: string;
// }

// // PUT /registreringer/{id}/svarbrev/receivers
// interface UpdateReceiversPayload {
//   receivers: Recipient[];
// }

// // PUT /registreringer/{id}/svarbrev/title
// interface UpdateSvarbrevTitlePayload {
//   title: string;
// }

// // PUT /registreringer/{id}/svarbrev/custom-text
// interface UpdateCustomTextPayload {
//   customText: string | null;
// }

// // GET /registreringer/{id}
// interface Registrering {
//   id: string; // UUID
//   fnr: string;
//   journalpostId: string | null;
//   typeId: Type | null; // Samme type-IDer som i Kodeverket.
//   mulighet: Mulighet | null;

//   // Overstyringer
//   overstyringer: {
//     mottattVedtaksinstans: string | null; // Date, ikke relevant for anke
//     mottattKlageinstans: string | null; // Date
//     behandlingstid: Behandlingstid | null;
//     hjemmelIdList: string[] | null;
//     ytelseId: string | null;
//     fullmektig: IPart | null;
//     klager: IPart | null;
//     avsender: IPart | null;
//     saksbehandlerIdent: string | null; // NAV ident
//     oppgaveId: string | null; // Gosys-oppgave
//   };

//   // Svarbrev
//   svarbrev: {
//     send: boolean;
//     behandlingstid: Behandlingstid | null;
//     fullmektigFritekst: string | null;
//     receivers: Recipient[];
//     title: string; // default DEFAULT_SVARBREV_NAME
//     customText: string | null;
//   };
// }

// const DEFAULT_SVARBREV_NAME = 'NAV orienterer om saksbehandlingen';

// enum Type {
//   KLAGE,
//   ANKE,
// }

// interface Mulighet {
//   id: string;
//   sourceId: string;
// }

// interface Behandlingstid {
//   units: number;
//   unitTypeId: BehandlingstidUnitType;
// }

// enum BehandlingstidUnitType {
//   WEEKS = '1',
//   MONTHS = '2',
// }

// interface IPart {
//   id: string;
//   type: IdType.FNR;
//   name: string | null;
//   available: boolean;
//   language: string;
//   address: IAddress | null;
//   utsendingskanal: Utsendingskanal;
//   statusList: IPersonStatus[] | IOrganizationStatus[];
// }

// enum HandlingEnum {
//   AUTO = 'AUTO',
//   LOCAL_PRINT = 'LOCAL_PRINT',
//   CENTRAL_PRINT = 'CENTRAL_PRINT',
// }

// interface Recipient {
//   part: IPart;
//   handling: HandlingEnum;
//   overriddenAddress: IAddress | null;
// }

// interface BaseAddress {
//   adresselinje2: string | null;
//   adresselinje3: string | null;
// }

// interface NorwegianAddress extends BaseAddress {
//   adresselinje1: string | null;
//   postnummer: string;
//   landkode: 'NO';
// }

// interface ForeignAddress extends BaseAddress {
//   adresselinje1: string;
//   postnummer: string | null;
//   landkode: string;
// }

// type IAddress = NorwegianAddress | ForeignAddress;

// type IPersonStatus =
//   | {
//       status: PartStatusEnum.DEAD;
//       date: string;
//     }
//   | {
//       status: PartStatusEnum.EGEN_ANSATT;
//       date: null;
//     }
//   | {
//       status: PartStatusEnum.VERGEMAAL;
//       date: null;
//     }
//   | {
//       status: PartStatusEnum.FULLMAKT;
//       date: null;
//     }
//   | {
//       status: PartStatusEnum.FORTROLIG;
//       date: null;
//     }
//   | {
//       status: PartStatusEnum.STRENGT_FORTROLIG;
//       date: null;
//     }
//   | {
//       status: PartStatusEnum.RESERVERT_I_KRR;
//       date: null;
//     };

// type IOrganizationStatus =
//   | {
//       status: PartStatusEnum.DELETED;
//       date: string;
//     }
//   | {
//       status: PartStatusEnum.DELT_ANSVAR;
//       date: null;
//     };

// enum PartStatusEnum {
//   DEAD = 'DEAD',
//   DELETED = 'DELETED',
//   EGEN_ANSATT = 'EGEN_ANSATT',
//   VERGEMAAL = 'VERGEMAAL',
//   FULLMAKT = 'FULLMAKT',
//   FORTROLIG = 'FORTROLIG',
//   STRENGT_FORTROLIG = 'STRENGT_FORTROLIG',
//   RESERVERT_I_KRR = 'RESERVERT_I_KRR',
//   DELT_ANSVAR = 'DELT_ANSVAR',
// }

// enum IdType {
//   FNR = 'FNR',
//   ORGNR = 'ORGNR',
// }

// enum Utsendingskanal {
//   SENTRAL_UTSKRIFT = 'SENTRAL_UTSKRIFT',
//   SDP = 'SDP',
//   NAV_NO = 'NAV_NO',
//   LOKAL_UTSKRIFT = 'LOKAL_UTSKRIFT',
//   INGEN_DISTRIBUSJON = 'INGEN_DISTRIBUSJON',
//   TRYGDERETTEN = 'TRYGDERETTEN',
//   DPVT = 'DPVT',
// }
