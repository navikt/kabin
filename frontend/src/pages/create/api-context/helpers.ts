import { avsenderIsPart } from '@app/domain/converters';
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
  overstyringerChanges: Partial<T['overstyringer']>,
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
          : error,
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
    overstyringer: ankemulighetIsDifferent
      ? {
          ...state.overstyringer,
          ...update.overstyringer,
          klager: klager === undefined ? mulighet?.klager ?? null : klager, // If no klager is provided in the update, use klager from mulighet.
          fullmektig: fullmektig === undefined ? mulighet?.fullmektig ?? null : fullmektig, // If no fullmektig is provided in the update, use fullmektig from mulighet.
          ytelseId: mulighet?.ytelseId ?? null,
          hjemmelId: mulighet?.hjemmelId ?? null,
        }
      : {
          ...state.overstyringer,
          ...rest,
          klager: klager === undefined ? state.overstyringer.klager : klager, // If no klager is provided in the update, use the previous one.
          fullmektig: fullmektig === undefined ? state.overstyringer.fullmektig : fullmektig, // If no fullmektig is provided in the update, use the previous one.
          saksbehandlerIdent,
        },
  };
};

export const getUpdatedKlageState = (
  state: IKlageState,
  newState: Payload<IKlageStateUpdate, IKlageState>,
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
    hjemmelId,
    saksbehandlerIdent = state.overstyringer.saksbehandlerIdent,
    ...rest
  } = update.overstyringer ?? {};

  return {
    mulighet: hasKlagemulighet ? updateMulighet ?? null : state.mulighet,
    overstyringer: klagemulighetIsDifferent
      ? {
          ...state.overstyringer,
          ...update.overstyringer,
          klager: klager === undefined ? null : klager, // If no klager is provided in the update, use none.
          fullmektig: fullmektig === undefined ? null : fullmektig, // If no fullmektig is provided in the update, use none.
          ytelseId: null,
          hjemmelId: null,
        }
      : {
          ...state.overstyringer,
          ...rest,
          klager: klager === undefined ? state.overstyringer.klager : klager, // If no klager is provided in the update, use the previous one.
          fullmektig: fullmektig === undefined ? state.overstyringer.fullmektig : fullmektig, // If no fullmektig is provided in the update, use the previous one.
          hjemmelId: hjemmelId ?? state.overstyringer.hjemmelId,
          saksbehandlerIdent: ytelseIsDifferent ? null : saksbehandlerIdent,
        },
  };
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
