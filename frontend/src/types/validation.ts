export enum SectionNames {
  SAKSDATA = 'saksdata',
  SVARBREV = 'svarbrev',
}

export interface IValidationError {
  reason: string;
  field: ValidationFieldNames;
}

export interface IValidationSection {
  section: SectionNames;
  properties: IValidationError[];
}

export interface IApiValidationResponse {
  status: number;
  title: string;
  sections: IValidationSection[];
}

export enum ValidationFieldNames {
  MOTTATT_KLAGEINSTANS = 'mottattKlageinstans',
  MOTTATT_VEDTAKSINSTANS = 'mottattVedtaksinstans',
  FRIST = 'frist',
  AVSENDER = 'avsender',
  KLAGER = 'klager',
  FULLMEKTIG = 'fullmektig',
  YTELSE_ID = 'ytelseId',
  HJEMMEL_ID_LIST = 'hjemmelIdList',
  BEHANDLING_ID = 'behandlingId',
  JOURNALPOST_ID = 'journalpostId',
  SAKSBEHANDLER = 'saksbehandlerId',
  // Frontend specific
  MULIGHET = 'mulighet',
  ENHET = 'enhet',
}
