export interface IKodeverkSimpleValue<T extends string = string> {
  id: T;
  navn: string;
}

export interface IKodeverkValue<T extends string = string> extends IKodeverkSimpleValue<T> {
  beskrivelse: string;
}

interface ILovkildeToRegistreringshjemler {
  lovkilde: IKodeverkSimpleValue[];
  registreringshjemler: IKodeverkSimpleValue[];
}

export interface IYtelserLatest extends IKodeverkSimpleValue<string> {
  lovKildeToRegistreringshjemler: ILovkildeToRegistreringshjemler[];
  enheter: IKodeverkSimpleValue[];
  klageenheter: IKodeverkSimpleValue[];
  innsendingshjemler: IKodeverkValue[];
}

export interface IFagsystem extends IKodeverkValue {
  modernized: boolean;
}
