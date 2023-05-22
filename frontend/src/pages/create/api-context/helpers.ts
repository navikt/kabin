import { avsenderIsPart } from '@app/domain/converters';
import { isNotUndefined } from '@app/functions/is-not';
import { IPart } from '@app/types/common';
import { IArkivertDocument, JournalposttypeEnum } from '@app/types/dokument';
import { IAnkeMulighet, IKlagemulighet } from '@app/types/mulighet';
import { IValidationSection, SectionNames, ValidationFieldNames } from '@app/types/validation';
import { IAnkeState, IAnkeStateUpdate, IKlageState, IKlageStateUpdate, Payload, Type } from './types';

const TYPES = Object.values(Type);
export const isType = (type: string): type is Type => TYPES.some((t) => t === type);

export const NOOP = () => {
  /* No operation */
};

export const getStateWithOverstyringer = <T extends IKlageState | IAnkeState>(
  state: T,
  overstyringerChanges: Partial<T['overstyringer']>
) => ({
  ...state,
  overstyringer: {
    ...state.overstyringer,
    ...overstyringerChanges,
  },
});

const removeSaksdataErrors = (errors: IValidationSection[] | null, fields: ValidationFieldNames[]) =>
  errors === null
    ? errors
    : errors.map((error) =>
        error.section === SectionNames.SAKSDATA
          ? {
              section: SectionNames.SAKSDATA,
              properties: error.properties.filter((p) => !fields.includes(p.field)),
            }
          : error
      );

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

export const getUpdatedAnkeState = (state: IAnkeState, newState: Payload<IAnkeStateUpdate, IAnkeState>): IAnkeState => {
  const update = typeof newState === 'function' ? newState(state) : newState;

  const updateMulighet = update.mulighet;
  const hasAnkemulighet = typeof updateMulighet !== 'undefined';
  const ankemulighetIsDifferent = hasAnkemulighet && !muligheterAreEqual(updateMulighet, state.mulighet);

  cleanObject(update.overstyringer);

  if (hasAnkemulighet) {
    cleanObject(updateMulighet);
  }

  const mulighet = hasAnkemulighet ? updateMulighet : state.mulighet;

  const {
    klager,
    fullmektig,
    saksbehandlerIdent = state.overstyringer.saksbehandlerIdent,
    ...rest
  } = update.overstyringer ?? {};

  return {
    mulighet,
    overstyringer: {
      ...state.overstyringer,
      ...rest,
      klager: getPart(ankemulighetIsDifferent, mulighet?.klager, klager, state.overstyringer.klager),
      fullmektig: getPart(ankemulighetIsDifferent, mulighet?.fullmektig, fullmektig, state.overstyringer.fullmektig),
      saksbehandlerIdent: ankemulighetIsDifferent ? null : saksbehandlerIdent,
    },
  };
};

export const getUpdatedKlageState = (
  state: IKlageState,
  newState: Payload<IKlageStateUpdate, IKlageState>
): IKlageState => {
  const update = typeof newState === 'function' ? newState(state) : newState;

  const updateMulighet = update.mulighet;
  const hasKlagemulighet = typeof updateMulighet !== 'undefined';
  const klagemulighetIsDifferent = hasKlagemulighet && !muligheterAreEqual(updateMulighet, state.mulighet);

  const updateYtelse = update.overstyringer?.ytelseId;
  const hasYtelse = typeof updateYtelse !== 'undefined';
  const ytelseIsDifferent = hasYtelse && updateYtelse !== state.overstyringer.ytelseId;

  cleanObject(update.overstyringer);

  if (hasKlagemulighet) {
    cleanObject(updateMulighet);
  }

  const {
    klager,
    fullmektig,
    hjemmelIdList,
    saksbehandlerIdent = state.overstyringer.saksbehandlerIdent,
    ...rest
  } = update.overstyringer ?? {};

  return {
    mulighet: hasKlagemulighet ? updateMulighet ?? null : state.mulighet,
    overstyringer: {
      ...state.overstyringer,
      ...rest,
      klager: getPart(klagemulighetIsDifferent, null, klager, state.overstyringer.klager),
      fullmektig: getPart(klagemulighetIsDifferent, null, fullmektig, state.overstyringer.fullmektig),
      hjemmelIdList: hjemmelIdList?.filter(isNotUndefined) ?? state.overstyringer.hjemmelIdList,
      saksbehandlerIdent: ytelseIsDifferent ? null : saksbehandlerIdent,
    },
  };
};

const getPart = (
  different: boolean,
  mulighetPart: IPart | null | undefined = null,
  newPart: IPart | null | undefined,
  previousPart: IPart | null
): IPart | null => {
  if (typeof newPart !== 'undefined') {
    return newPart;
  }

  return different ? mulighetPart : previousPart;
};

const muligheterAreEqual = (a: IKlagemulighet | IAnkeMulighet | null, b: IKlagemulighet | IAnkeMulighet | null) => {
  if (a === b) {
    return true;
  }

  if (a === null || b === null) {
    return false;
  }

  return a.fagsakId === b.fagsakId && a.fagsystemId === b.fagsystemId && a.vedtakDate === b.vedtakDate;
};

const isObject = (o: object | undefined | null): o is Record<string, unknown> => o !== null && typeof o === 'object';

const cleanObject = <T extends object | undefined | null>(obj: T): T => {
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
