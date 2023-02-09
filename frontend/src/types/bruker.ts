interface IEnhet {
  id: string;
  navn: string;
  lovligeYtelser: string[];
}

// eslint-disable-next-line import/no-unused-modules
export interface IUserData {
  navIdent: string;
  enheter: IEnhet[];
  ansattEnhet: IEnhet;
}
