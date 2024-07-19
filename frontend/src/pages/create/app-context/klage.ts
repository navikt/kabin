import { cleanObject, muligheterAreEqual } from '@app/pages/create/app-context/helpers';
import { IKlageState, IKlageStateUpdate, State, Svarbrev } from './types';

export const getUpdatedKlageState = (
  state: IKlageState,
  newState: State<IKlageStateUpdate, IKlageState>,
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
    mulighet: hasKlagemulighet ? (updateMulighet ?? null) : state.mulighet,
    overstyringer: klagemulighetIsDifferent
      ? {
          ...state.overstyringer,
          ...update.overstyringer,
          klager: klager === undefined ? null : klager, // If no klager is provided in the update, use none.
          fullmektig: fullmektig === undefined ? null : fullmektig, // If no fullmektig is provided in the update, use none.
          ytelseId: null,
          hjemmelIdList: [],
          mottattKlageinstans: updateMulighet === null ? null : updateMulighet.vedtakDate,
        }
      : {
          ...state.overstyringer,
          ...rest,
          klager: klager === undefined ? state.overstyringer.klager : klager, // If no klager is provided in the update, use the previous one.
          fullmektig: fullmektig === undefined ? state.overstyringer.fullmektig : fullmektig, // If no fullmektig is provided in the update, use the previous one.
          hjemmelIdList: hjemmelIdList ?? state.overstyringer.hjemmelIdList,
          saksbehandlerIdent: ytelseIsDifferent ? null : saksbehandlerIdent,
        },
    sendSvarbrev: update.sendSvarbrev ?? state.sendSvarbrev,
    svarbrev: getSvarbrev(state.svarbrev, update.svarbrev),
  };
};

const getSvarbrev = (state: Svarbrev, update: Partial<Svarbrev> | undefined): Svarbrev => {
  if (update === undefined) {
    return state;
  }

  return {
    ...state,
    ...update,
  };
};
