export const skipToken = Symbol('skipToken');

interface INavn {
  fornavn: string | null;
  mellomnavn: string | null;
  etternavn: string | null;
}

interface IPerson {
  foedselsnummer: string;
  navn: INavn;
  kjoenn: string;
}

interface IVirksomhet {
  virksomhetsnummer: string;
  navn: string;
}

interface INoPart {
  person: null;
  virksomhet: null;
}

interface IPersonPart {
  person: IPerson;
  virksomhet: null;
}

interface IVirksomhetPart {
  person: null;
  virksomhet: IVirksomhet;
}

export type IPart = IPersonPart | IVirksomhetPart | INoPart;

export enum PartType {
  PERSON = 'PERSON',
  VIRKSOMHET = 'VIRKSOMHET',
}

export interface IPartId {
  type: PartType;
  value: string;
}

export interface ITilknyttetDokument {
  journalpostId: string;
  dokumentInfoId: string;
}

export enum SaksTypeEnum {
  KLAGE = '1',
  ANKE = '2',
}
