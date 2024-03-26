import { cleanObject, muligheterAreEqual } from '@app/pages/create/app-context/helpers';
import { IAnkeState, IAnkeStateUpdate, State, Svarbrev } from './types';

export const getUpdatedAnkeState = (state: IAnkeState, newState: State<IAnkeStateUpdate, IAnkeState>): IAnkeState => {
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
          hjemmelIdList: mulighet?.hjemmelIdList ?? [],
        }
      : {
          ...state.overstyringer,
          ...rest,
          klager: klager === undefined ? state.overstyringer.klager : klager, // If no klager is provided in the update, use the previous one.
          fullmektig: fullmektig === undefined ? state.overstyringer.fullmektig : fullmektig, // If no fullmektig is provided in the update, use the previous one.
          saksbehandlerIdent,
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
