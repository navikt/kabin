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
  navn: string;
  enheter: IEnhet[];
  ansattEnhet: IEnhet;
  roller: Role[];
}
