/* eslint-disable complexity */
/* eslint-disable max-lines */
import { format } from 'date-fns';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { FORMAT } from '@app/domain/date-formats';
import { compareMuligheter } from '@app/domain/mulighet';
import { isNotNullNorUndefined } from '@app/functions/is-not';
import { partToRecipient } from '@app/functions/part-to-recipient';
import { getUpdatedAnkeState } from '@app/pages/create/app-context/anke';
import { getUpdatedKlageState } from '@app/pages/create/app-context/klage';
import { IPart, skipToken } from '@app/types/common';
import { IValidationSection, SectionNames } from '@app/types/validation';
import {
  NOOP,
  getStateWithOverstyringer,
  getUpdateAvsender,
  isSvarbrevState,
  isSvarbrevUpdate,
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

      if (isSvarbrevUpdate(update) && isSvarbrevState(state)) {
        if (update.sendSvarbrev === false || update.svarbrev?.enhetId !== state.svarbrev.enhetId) {
          setErrors(errors === null ? null : errors.filter((e) => e.section !== SectionNames.SVARBREV));
        }

        const { overstyringer } = update;
        const previousFullmektig = state.overstyringer.fullmektig;
        const previousKlager = state.overstyringer.klager;

        if (overstyringer !== undefined) {
          const { fullmektig } = overstyringer;

          if (fullmektig !== undefined && fullmektig !== previousFullmektig) {
            const fullmektigFritekst = fullmektig?.name ?? null;

            if (update.svarbrev !== undefined) {
              update.svarbrev.fullmektigFritekst = fullmektigFritekst;
            } else {
              update.svarbrev = { ...state.svarbrev, fullmektigFritekst };
            }
          }
        }

        const updatedState = { ...state, ...update };

        if (update.overstyringer === undefined || state.mulighet === null) {
          return setState(updatedState);
        }

        const { fullmektig, klager } = update.overstyringer;

        if (fullmektig === undefined && klager === undefined) {
          return setState(updatedState);
        }

        const { sakenGjelder } = state.mulighet;

        const nextSuggestions: IPart[] = [
          sakenGjelder,
          sakenGjelder.id === klager?.id ? null : klager,
          fullmektig,
        ].filter(isNotNullNorUndefined);

        const previousSuggestions: IPart[] = [
          sakenGjelder,
          previousKlager?.id === sakenGjelder.id ? null : previousKlager,
          previousFullmektig,
        ].filter(isNotNullNorUndefined);

        const previousReceivers = state.svarbrev.receivers;

        // If saken gjelder was automatically selected, and there are more potential recipients, unselect it.
        if (nextSuggestions.length > 1 && previousReceivers.length === 1 && previousSuggestions.length === 1) {
          return setState({ ...updatedState, svarbrev: { ...updatedState.svarbrev, receivers: [] } });
        }

        // If there is only one potential recipient, and none selected, add it to the list of selected recipients.
        if (nextSuggestions.length === 1 && previousReceivers.length === 0) {
          // Add automatically selected recipient.
          return setState({
            ...updatedState,
            svarbrev: { ...updatedState.svarbrev, receivers: nextSuggestions.map(partToRecipient) },
          });
        }

        const removedSuggestions = previousSuggestions.filter(
          (prev) => !nextSuggestions.some((next) => next.id === prev.id),
        );

        const incomingReceivers = update.svarbrev?.receivers ?? previousReceivers;

        const updatedReceivers =
          removedSuggestions.length === 0
            ? [...incomingReceivers]
            : incomingReceivers.filter((r) => !removedSuggestions.some((s) => s.id === r.part.id));

        const fullmektigWasSelected =
          previousFullmektig !== null && incomingReceivers.some((r) => r.part.id === previousFullmektig.id);

        const klagerWasSelected =
          previousKlager !== null && incomingReceivers.some((r) => r.part.id === previousKlager.id);

        if (
          fullmektigWasSelected &&
          isNotNullNorUndefined(fullmektig) &&
          !updatedReceivers.some((r) => r.part.id === fullmektig.id)
        ) {
          updatedReceivers.push(partToRecipient(fullmektig));
        }

        if (
          klagerWasSelected &&
          isNotNullNorUndefined(klager) &&
          !updatedReceivers.some((r) => r.part.id === klager.id)
        ) {
          updatedReceivers.push(partToRecipient(klager));
        }

        return setState({ ...updatedState, svarbrev: { ...updatedState.svarbrev, receivers: updatedReceivers } });
      }

      return setState({ ...state, ...update });
    },
    [errors, state],
  );

  return [state, updateState, errors, setErrors];
};
