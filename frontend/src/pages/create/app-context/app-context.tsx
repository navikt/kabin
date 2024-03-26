import { format } from 'date-fns';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { FORMAT } from '@app/domain/date-formats';
import { compareMuligheter } from '@app/domain/mulighet';
import { getUpdatedAnkeState } from '@app/pages/create/app-context/anke';
import { getUpdatedKlageState } from '@app/pages/create/app-context/klage';
import { skipToken } from '@app/types/common';
import { IValidationSection, SectionNames } from '@app/types/validation';
import {
  NOOP,
  getStateWithOverstyringer,
  getUpdateAvsender,
  removeErrorsOnJournalpostChange,
  removeErrorsOnMulighetChange,
} from './helpers';
import {
  IAnkeState,
  IAnkeStateUpdate,
  IAppContext,
  IKlageState,
  IKlageStateUpdate,
  INITIAL_ANKE,
  INITIAL_KLAGE,
  State,
  Type,
  UpdateErrorsFn,
  UpdateFn,
} from './types';

export const AppContext = createContext<IAppContext>({
  type: Type.NONE,
  setType: NOOP,
  state: null,
  updateState: NOOP,
  errors: null,
  setErrors: NOOP,
  fnr: skipToken,
  journalpost: null,
  setJournalpost: NOOP,
});

interface Props {
  fnr: IAppContext['fnr'];
  children: React.ReactNode;
}

export const AppContextState = ({ fnr, children }: Props) => {
  const context = useContextData(fnr);

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};

const useContextData = (fnr: IAppContext['fnr']): IAppContext => {
  const [type, setType] = useState<Type>(Type.NONE);
  const [journalpost, setInternalJournalpost] = useState<IAppContext['journalpost']>(null);
  const [klage, updateKlage, klageErrors, setKlageErrors] = useApiContext<IKlageStateUpdate, IKlageState>(
    INITIAL_KLAGE,
  );
  const [anke, updateAnke, ankeErrors, setAnkeErrors] = useApiContext<IAnkeStateUpdate, IAnkeState>(INITIAL_ANKE);

  useEffect(() => setType(Type.NONE), [fnr]);

  const setJournalpost: IAppContext['setJournalpost'] = useCallback(
    (newJournalpost) => {
      const update = typeof newJournalpost === 'function' ? newJournalpost(journalpost) : newJournalpost;

      if (update === journalpost) {
        return;
      }

      setInternalJournalpost(update);

      setKlageErrors(removeErrorsOnJournalpostChange(klageErrors));
      setAnkeErrors(removeErrorsOnJournalpostChange(ankeErrors));

      const avsender = getUpdateAvsender(update);
      const mottattNav = update?.datoOpprettet.substring(0, FORMAT.length) ?? null;
      const now = format(new Date(), FORMAT);

      updateKlage((k) =>
        getStateWithOverstyringer(k, { mottattVedtaksinstans: mottattNav, mottattKlageinstans: now, avsender }),
      );
      updateAnke((a) => getStateWithOverstyringer(a, { mottattKlageinstans: mottattNav, avsender }));
    },
    [ankeErrors, journalpost, klageErrors, setAnkeErrors, setKlageErrors, updateAnke, updateKlage],
  );

  const base: Pick<IAppContext, 'setType' | 'fnr' | 'journalpost' | 'setJournalpost'> = {
    setType,
    fnr,
    journalpost,
    setJournalpost,
  };

  switch (type) {
    case Type.NONE:
      return { ...base, type, state: null, updateState: NOOP, errors: null, setErrors: NOOP };
    case Type.KLAGE:
      return {
        ...base,
        type,
        state: klage,
        updateState: (newState) => updateKlage(getUpdatedKlageState(klage, newState)),
        errors: klageErrors,
        setErrors: setKlageErrors,
      };
    case Type.ANKE:
      return {
        ...base,
        type,
        state: anke,
        updateState: (newState) => updateAnke(getUpdatedAnkeState(anke, newState)),
        errors: ankeErrors,
        setErrors: setAnkeErrors,
      };
  }
};

type UseApiContextValue<P, S> = [
  S,
  UpdateFn<P, S>,
  IValidationSection[] | null,
  (errors: IValidationSection[] | null | UpdateErrorsFn) => void,
];

const useApiContext = <P extends IKlageStateUpdate | IAnkeStateUpdate, S extends IKlageState | IAnkeState>(
  initialState: S,
): UseApiContextValue<P, S> => {
  const [state, setState] = useState<S>(initialState);
  const [errors, setErrors] = useState<IValidationSection[] | null>(null);

  const updateState = useCallback(
    (newState: State<P, S>) => {
      const update = typeof newState === 'function' ? newState(state) : newState;

      if (typeof update.mulighet !== 'undefined') {
        if (!compareMuligheter(update.mulighet, state.mulighet)) {
          setErrors(removeErrorsOnMulighetChange(errors));
        }
      }

      if (isAnkeUpdate(update) && isAnkeState(state)) {
        if (update.sendSvarbrev === false || update.svarbrev?.enhetId !== state.svarbrev.enhetId) {
          setErrors(errors === null ? null : errors.filter((e) => e.section !== SectionNames.SVARBREV));
        }

        const updateOverstyringer = update.overstyringer;

        if (updateOverstyringer !== undefined) {
          const updateFullmektig = updateOverstyringer.fullmektig;

          if (updateFullmektig !== undefined && updateFullmektig !== state.overstyringer.fullmektig) {
            const fullmektigFritekst = updateFullmektig?.name ?? null;

            if (update.svarbrev !== undefined) {
              update.svarbrev.fullmektigFritekst = fullmektigFritekst;
            } else {
              update.svarbrev = { ...state.svarbrev, fullmektigFritekst };
            }
          }
        }
      }

      setState({ ...state, ...update });
    },
    [errors, state],
  );

  return [state, updateState, errors, setErrors];
};

const isAnkeState = (state: IAppContext['state']): state is IAnkeState => state !== null && 'sendSvarbrev' in state;
const isAnkeUpdate = (update: IKlageStateUpdate | IAnkeStateUpdate): update is IAnkeStateUpdate =>
  'svarbrev' in update || 'sendSvarbrev' in update;
