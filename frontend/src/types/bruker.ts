interface IEnhet {
  id: string;
  navn: string;
  lovligeYtelser: string[];
}

export enum Role {
  KABAL_OPPGAVESTYRING_ALLE_ENHETER = 'KABAL_OPPGAVESTYRING_ALLE_ENHETER',
  KABAL_ADMIN = 'KABAL_ADMIN',
}

const ALL_ROLES = Object.values(Role);
export const ALL_PUBLIC_ROLES = ALL_ROLES.filter((r) => r !== Role.KABAL_ADMIN);

export interface IUserData {
  navIdent: string;
  navn: string;
  enheter: IEnhet[];
  ansattEnhet: IEnhet;
  roller: Role[];
}

export const ROLE_NAMES: Record<Role, string> = {
  [Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER]: 'Kabal oppgavestyring alle enheter',
  [Role.KABAL_ADMIN]: 'Kabal admin',
};
