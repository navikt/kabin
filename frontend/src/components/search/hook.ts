import { idnr } from '@navikt/fnrvalidator';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearchPart } from '@app/simple-api-state/use-api';
import { ISimplePart, skipToken } from '@app/types/common';

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
  const fnr = useStateSearch();
  const [rawSearch, setRawSearch] = useState<string>(fnr);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const cleaned = rawSearch.replaceAll(' ', '');
  const isValid = idnr(cleaned).status === 'valid';
  const search = isValid ? cleaned : skipToken;
  const { data: person = null, isLoading, isSuccess } = useSearchPart(search);

  if (isSuccess && pathname !== '/opprett' && isValid) {
    navigate(`/opprett`, { state: { search } });
  }

  if (isValid && error !== undefined) {
    setError(undefined);
  }

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
