import React, { createContext, useCallback, useState } from 'react';
import { IValidationSection } from '@app/components/footer/error-type-guard';
import { skipToken } from '@app/types/common';
import {
  NOOP,
  getStateWithOverstyringer,
  getUpdatedAnkeState,
  getUpdatedKlageState,
  removeAvsenderError,
} from './helpers';
import { IAnkeState, IApiContext, IKlageState, Payload, Type, UpdateFn } from './types';

export const ApiContext = createContext<IApiContext>({
  type: Type.NONE,
  setType: NOOP,
  payload: null,
  updatePayload: NOOP,
  errors: null,
  setErrors: NOOP,
  fnr: skipToken,
  journalpost: null,
  setJournalpost: NOOP,
});

interface Props {
  fnr: IApiContext['fnr'];
  children: React.ReactNode;
}

export const ApiContextState = ({ fnr, children }: Props) => {
  const context = useContextData(fnr);

  return <ApiContext.Provider value={context}>{children}</ApiContext.Provider>;
};

const INITIAL_KLAGE: IKlageState = {
  mulighet: null,
  overstyringer: {
    fristInWeeks: 12,
    fullmektig: null,
    klager: null,
    mottattNav: null,
    avsender: null,
  },
};

const INITIAL_ANKE: IAnkeState = {
  mulighet: null,
  overstyringer: {
    fristInWeeks: 12,
    fullmektig: null,
    klager: null,
    mottattNav: null,
    avsender: null,
  },
};

const useContextData = (fnr: IApiContext['fnr']): IApiContext => {
  const [type, setType] = useState<Type>(Type.ANKE); // TODO: Set to NONE when klage is supported.
  const [journalpost, setInternalJournalpost] = useState<IApiContext['journalpost']>(null);
  const [klage, updateKlage, klageErrors, setKlageErrors] = useApiContext<IKlageState>(INITIAL_KLAGE);
  const [anke, updateAnke, ankeErrors, setAnkeErrors] = useApiContext<IAnkeState>(INITIAL_ANKE);

  const setJournalpost: IApiContext['setJournalpost'] = useCallback(
    (newJournalpost) => {
      const update = typeof newJournalpost === 'function' ? newJournalpost(journalpost) : newJournalpost;

      if (update === journalpost) {
        return;
      }

      setInternalJournalpost(update);

      setKlageErrors(removeAvsenderError);
      setAnkeErrors(removeAvsenderError);

      const mottattNav = update?.datoOpprettet ?? null;
      updateKlage((k) => getStateWithOverstyringer(k, { mottattNav, avsender: update?.avsenderMottaker ?? null }));
      updateAnke((a) => getStateWithOverstyringer(a, { mottattNav, avsender: update?.avsenderMottaker ?? null }));
    },
    [journalpost, setAnkeErrors, setKlageErrors, updateAnke, updateKlage]
  );

  const base: Pick<IApiContext, 'setType' | 'fnr' | 'journalpost' | 'setJournalpost'> = {
    setType,
    fnr,
    journalpost,
    setJournalpost,
  };

  switch (type) {
    case Type.NONE:
      return { ...base, type, payload: null, updatePayload: NOOP, errors: null, setErrors: NOOP };
    case Type.KLAGE:
      return {
        ...base,
        type,
        payload: klage,
        updatePayload: (newPayload) => updateKlage(getUpdatedKlageState(klage, newPayload)),
        errors: klageErrors,
        setErrors: setKlageErrors,
      };
    case Type.ANKE:
      return {
        ...base,
        type,
        payload: anke,
        updatePayload: (newPayload) => updateAnke(getUpdatedAnkeState(anke, newPayload)),
        errors: ankeErrors,
        setErrors: setAnkeErrors,
      };
  }
};

type UpdateErrorsFn = (errors: IValidationSection[] | null) => IValidationSection[] | null;

type UseApiContextValue<T> = [
  T,
  UpdateFn<T>,
  IValidationSection[] | null,
  (errors: IValidationSection[] | null | UpdateErrorsFn) => void
];

const useApiContext = <T,>(initialState: T): UseApiContextValue<T> => {
  const [payload, setPayload] = useState<T>(initialState);
  const [errors, setErrors] = useState<IValidationSection[] | null>(null);

  const updatePayload = useCallback(
    (newPayload: Payload<T>) => {
      const update = typeof newPayload === 'function' ? newPayload(payload) : newPayload;
      setPayload({ ...payload, ...update });
    },
    [payload]
  );

  return [payload, updatePayload, errors, setErrors];
};
