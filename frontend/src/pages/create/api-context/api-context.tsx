import { format } from 'date-fns';
import React, { createContext, useCallback, useState } from 'react';
import { FORMAT } from '@app/domain/date-formats';
import { compareMuligheter } from '@app/domain/mulighet';
import { skipToken } from '@app/types/common';
import { IValidationSection } from '@app/types/validation';
import {
  NOOP,
  getStateWithOverstyringer,
  getUpdateAvsender,
  getUpdatedAnkeState,
  getUpdatedKlageState,
  removeErrorsOnJournalpostChange,
  removeErrorsOnMulighetChange,
} from './helpers';
import {
  IAnkeState,
  IAnkeStateUpdate,
  IApiContext,
  IKlageState,
  IKlageStateUpdate,
  Payload,
  Type,
  UpdateFn,
} from './types';

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
    mottattVedtaksinstans: null,
    mottattKlageinstans: null,
    hjemmelIdList: [],
    ytelseId: null,
    fristInWeeks: 12,
    fullmektig: null,
    klager: null,
    avsender: null,
  },
};

const INITIAL_ANKE: IAnkeState = {
  mulighet: null,
  overstyringer: {
    fristInWeeks: 12,
    fullmektig: null,
    klager: null,
    mottattKlageinstans: null,
    avsender: null,
  },
};

const useContextData = (fnr: IApiContext['fnr']): IApiContext => {
  const [type, setType] = useState<Type>(Type.ANKE); // TODO: Set to NONE when klage is supported.
  const [journalpost, setInternalJournalpost] = useState<IApiContext['journalpost']>(null);
  const [klage, updateKlage, klageErrors, setKlageErrors] = useApiContext<IKlageStateUpdate, IKlageState>(
    INITIAL_KLAGE
  );
  const [anke, updateAnke, ankeErrors, setAnkeErrors] = useApiContext<IAnkeStateUpdate, IAnkeState>(INITIAL_ANKE);

  const setJournalpost: IApiContext['setJournalpost'] = useCallback(
    (newJournalpost) => {
      const update = typeof newJournalpost === 'function' ? newJournalpost(journalpost) : newJournalpost;

      if (update === journalpost) {
        return;
      }

      setInternalJournalpost(update);

      setKlageErrors(removeErrorsOnJournalpostChange(klageErrors));
      setAnkeErrors(removeErrorsOnJournalpostChange(ankeErrors));

      const avsender = getUpdateAvsender(update);
      const mottattNav = update?.registrert ?? null;
      const now = format(new Date(), FORMAT);

      updateKlage((k) =>
        getStateWithOverstyringer(k, { mottattVedtaksinstans: mottattNav, mottattKlageinstans: now, avsender })
      );
      updateAnke((a) => getStateWithOverstyringer(a, { mottattKlageinstans: mottattNav, avsender }));
    },
    [ankeErrors, journalpost, klageErrors, setAnkeErrors, setKlageErrors, updateAnke, updateKlage]
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
        errors: removeErrorsOnMulighetChange(klageErrors),
        setErrors: setKlageErrors,
      };
    case Type.ANKE:
      return {
        ...base,
        type,
        payload: anke,
        updatePayload: (newPayload) => updateAnke(getUpdatedAnkeState(anke, newPayload)),
        errors: removeErrorsOnMulighetChange(ankeErrors),
        setErrors: setAnkeErrors,
      };
  }
};

type UpdateErrorsFn = (errors: IValidationSection[] | null) => IValidationSection[] | null;

type UseApiContextValue<P, S> = [
  S,
  UpdateFn<P, S>,
  IValidationSection[] | null,
  (errors: IValidationSection[] | null | UpdateErrorsFn) => void
];

const useApiContext = <P extends IKlageStateUpdate | IAnkeStateUpdate, S extends IKlageState | IAnkeState>(
  initialState: S
): UseApiContextValue<P, S> => {
  const [payload, setPayload] = useState<S>(initialState);
  const [errors, setErrors] = useState<IValidationSection[] | null>(null);

  const updatePayload = useCallback(
    (newPayload: Payload<P, S>) => {
      const update = typeof newPayload === 'function' ? newPayload(payload) : newPayload;

      if (typeof update.mulighet !== 'undefined') {
        if (!compareMuligheter(update.mulighet, payload.mulighet)) {
          setErrors(removeErrorsOnMulighetChange(errors));
        }
      }
      setPayload({ ...payload, ...update });
    },
    [errors, payload]
  );

  return [payload, updatePayload, errors, setErrors];
};
