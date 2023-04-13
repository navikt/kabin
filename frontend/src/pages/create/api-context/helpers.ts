import { IValidationSection } from '@app/components/footer/error-type-guard';
import { ValidationFieldNames } from '@app/hooks/use-field-name';
import { SectionNames } from '@app/hooks/use-section-title';
import { IAnkeState, IKlageState, Payload, Type } from './types';

const TYPES = Object.values(Type);
export const isType = (type: string): type is Type => TYPES.some((t) => t === type);

export const NOOP = () => {
  /* No operation */
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

export const removeAvsenderError = (errors: IValidationSection[] | null) =>
  errors === null
    ? errors
    : errors.map((error) =>
        error.section === SectionNames.SAKSDATA
          ? {
              section: SectionNames.SAKSDATA,
              properties: error.properties.filter(({ field }) => field !== ValidationFieldNames.AVSENDER),
            }
          : error
      );

export const getUpdatedAnkeState = (state: IAnkeState, newState: Payload<IAnkeState>): IAnkeState => {
  const update = typeof newState === 'function' ? newState(state) : newState;

  const { mulighet, overstyringer } = update;

  const hasAnkemulighet = typeof mulighet !== 'undefined';

  cleanObject(overstyringer);

  if (hasAnkemulighet) {
    cleanObject(mulighet);
  }

  return {
    ...state,
    ...update,
    overstyringer: {
      ...state.overstyringer,
      fullmektig: hasAnkemulighet ? mulighet?.fullmektig ?? null : state.overstyringer.fullmektig,
      klager: hasAnkemulighet ? mulighet?.klager ?? null : state.overstyringer.klager,
      ...overstyringer,
    },
  };
};

export const getUpdatedKlageState = (state: IKlageState, newState: Payload<IKlageState>): IKlageState => {
  const update = typeof newState === 'function' ? newState(state) : newState;

  const { mulighet, overstyringer } = update;

  const hasKlagemulighet = typeof mulighet !== 'undefined';

  cleanObject(overstyringer);

  if (hasKlagemulighet) {
    cleanObject(mulighet);
  }

  return {
    ...state,
    ...update,
    overstyringer: {
      ...state.overstyringer,
      ...overstyringer,
    },
  };
};
