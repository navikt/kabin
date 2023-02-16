interface IEnhet {
  id: string;
  navn: string;
  lovligeYtelser: string[];
}

export interface IUserData {
  navIdent: string;
  enheter: IEnhet[];
  ansattEnhet: IEnhet;
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
