import { IAnkeState, IKlageState, Type } from '@app/pages/create/app-context/types';
import { skipToken } from '@app/types/common';
import { SourceId } from '@app/types/mulighet';

export const useParams = (
  type: Type,
  identifikator: string | typeof skipToken,
  state: IKlageState | IAnkeState | null,
) => {
  if (identifikator === skipToken) {
    return skipToken;
  }

  if (!oppgaverIsEnabled(type, state)) {
    return skipToken;
  }

  if (typeof state.mulighet.temaId === 'string') {
    return { identifikator, temaId: state.mulighet.temaId };
  }

  return { identifikator };
};

type NonNullableMulighet = NonNullable<IKlageState['mulighet'] | IAnkeState['mulighet']>;

type StateWithMulighet = (IKlageState | IAnkeState) & {
  mulighet: NonNullableMulighet;
};

export const oppgaverIsEnabled = (type: Type, state: IKlageState | IAnkeState | null): state is StateWithMulighet => {
  if (state === null || state.mulighet === null) {
    return false;
  }

  if (type === Type.KLAGE) {
    return true;
  }

  if (type === Type.ANKE && state.mulighet.fagsystemId === SourceId.INFOTRYGD) {
    return true;
  }

  return false;
};
