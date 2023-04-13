interface IEnhet {
  id: string;
  navn: string;
  lovligeYtelser: string[];
}

export enum Role {
  ROLE_KLAGE_OPPGAVESTYRING_ALLE_ENHETER = 'KABAL_OPPGAVESTYRING_ALLE_ENHETER',
  ROLE_ADMIN = 'KABAL_ADMIN',
}

export interface IUserData {
  navIdent: string;
  enheter: IEnhet[];
  ansattEnhet: IEnhet;
  roller: Role[];
}

interface ICustomUserInfo {
  customLongName: string | null;
  customShortName: string | null;
  customJobTitle: string | null;
}

export interface ISignatureResponse extends ICustomUserInfo {
  longName: string;
  generatedShortName: string;
}
