import { avsenderIsPart } from '@app/domain/converters';
import { IPart } from '@app/types/common';
import { IArkivertDocument, JournalposttypeEnum } from '@app/types/dokument';
import { IAnkeMulighet, IKlagemulighet } from '@app/types/mulighet';
import { IValidationSection, SectionNames, ValidationFieldNames } from '@app/types/validation';
import {
  IAnkeState,
  IAnkeStateUpdate,
  IAppContext,
  IKlageState,
  IKlageStateUpdate,
  Svarbrev,
  Type,
  ValidSvarbrev,
} from './types';

const TYPES = Object.values(Type);
export const isType = (type: string): type is Type => TYPES.some((t) => t === type);

export const NOOP = () => {
  /* No operation */
};

export const getStateWithOverstyringer = <T extends IKlageState | IAnkeState>(
  state: T,
  overstyringerChanges: Partial<T['overstyringer']>,
) => ({
  ...state,
  overstyringer: {
    ...state.overstyringer,
    ...overstyringerChanges,
  },
});

const removeSaksdataErrors = (errors: IValidationSection[] | null, fields: ValidationFieldNames[]) => {
  if (errors === null) {
    return errors;
  }

  return errors.map((error) => {
    if (error.section !== SectionNames.SAKSDATA) {
      return error;
    }

    return {
      section: SectionNames.SAKSDATA,
      properties: error.properties.filter((p) => !fields.includes(p.field)),
    };
  });
};

export const removeErrorsOnMulighetChange = (errors: IValidationSection[] | null) =>
  removeSaksdataErrors(errors, [ValidationFieldNames.FULLMEKTIG, ValidationFieldNames.KLAGER]);

export const removeErrorsOnJournalpostChange = (errors: IValidationSection[] | null) =>
  removeSaksdataErrors(errors, [
    ValidationFieldNames.MOTTATT_KLAGEINSTANS,
    ValidationFieldNames.MOTTATT_VEDTAKSINSTANS,
    ValidationFieldNames.AVSENDER,
  ]);

export const getUpdateAvsender = (update: IArkivertDocument | null): IPart | null => {
  if (
    update === null ||
    update.avsenderMottaker === null ||
    update.journalposttype !== JournalposttypeEnum.INNGAAENDE
  ) {
    return null;
  }

  if (avsenderIsPart(update.avsenderMottaker)) {
    return update.avsenderMottaker;
  }

  return null;
};

export const muligheterAreEqual = (
  a: IKlagemulighet | IAnkeMulighet | null,
  b: IKlagemulighet | IAnkeMulighet | null,
) => {
  if (a === b) {
    return true;
  }

  if (a === null || b === null) {
    return false;
  }

  return a.fagsakId === b.fagsakId && a.fagsystemId === b.fagsystemId && a.vedtakDate === b.vedtakDate;
};

const isObject = (o: object | undefined | null): o is Record<string, unknown> => o !== null && typeof o === 'object';

export const cleanObject = <T extends object | undefined | null>(obj: T): T => {
  if (!isObject(obj)) {
    return obj;
  }

  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }

  return obj;
};

export const isSvarbrevValid = (svarbrev: Svarbrev): svarbrev is ValidSvarbrev => svarbrev.enhetId !== null;

export const isSvarbrevState = (state: IAppContext['state']): state is IAnkeState =>
  state !== null && 'sendSvarbrev' in state && 'svarbrev' in state;

export const isSvarbrevUpdate = (update: IKlageStateUpdate | IAnkeStateUpdate): update is IAnkeStateUpdate =>
  'svarbrev' in update || 'sendSvarbrev' in update;
