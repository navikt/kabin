import { idnr } from '@navikt/fnrvalidator';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useGetPartQuery } from '@app/redux/api/part';
import { useSetSakenGjelderMutation } from '@app/redux/api/registrering';
import { ISimplePart } from '@app/types/common';

export interface IPersonSearch {
  rawSearch: string;
  search: string | typeof skipToken;
  onRawChange: (raw: string) => void;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
  person: ISimplePart | null;
  isLoading: boolean;
  isValid: boolean;
  error: string | undefined;
}

export const usePersonSearch = (): IPersonSearch => {
  const registreringId = useRegistreringId();
  const [setSakenGjelder] = useSetSakenGjelderMutation();
  const fnr = useStateSearch();
  const [rawSearch, setRawSearch] = useState<string>(fnr);
  const [error, setError] = useState<string>();

  const cleaned = rawSearch.replaceAll(' ', '');
  const isValid = idnr(cleaned).status === 'valid';
  const search = isValid ? cleaned : skipToken;
  const { data: person = null, isLoading } = useGetPartQuery(search);

  useEffect(() => {
    if (!isValid || registreringId === skipToken) {
      return;
    }

    if (person !== null) {
      setSakenGjelder({ id: registreringId, sakenGjelderValue: person.id });
    }

    if (error !== undefined) {
      setError(undefined);
    }
  }, [error, isValid, person, registreringId, setSakenGjelder]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = ({ key }) => {
    if (key === 'Escape') {
      setRawSearch('');

      return;
    }

    if (key !== 'Enter') {
      return;
    }

    setError(isValid ? undefined : 'Ugyldig ID-nummer');
  };

  return {
    rawSearch,
    search,
    onRawChange: setRawSearch,
    onKeyDown,
    person,
    isLoading,
    isValid,
    error,
  };
};

interface SearchState {
  search: string;
}

const isSearchState = (state: unknown): state is SearchState =>
  state !== null && typeof state === 'object' && 'search' in state;

const useStateSearch = () => {
  const l = useLocation();

  if (!isSearchState(l.state)) {
    return '';
  }

  const { search } = l.state;

  if (typeof search !== 'string' || search.length === 0) {
    return '';
  }

  return search;
};
