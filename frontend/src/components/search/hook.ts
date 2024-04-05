import { idnr } from '@navikt/fnrvalidator';
import { useEffect, useState } from 'react';
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
  const [search, setSearch] = useState<string | typeof skipToken>(fnr);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { data: person = null, isLoading, isSuccess } = useSearchPart(isValid ? search : skipToken);

  useEffect(() => {
    if (isSuccess && pathname !== '/opprett') {
      navigate(`/opprett`, { state: { search } });
    }
  }, [isSuccess, pathname, navigate, search]);

  const validate = () => setError(isValid ? undefined : 'Ugyldig ID-nummer');

  useEffect(() => {
    if (isValid) {
      setError(undefined);
    }
  }, [isValid]);

  const onRawChange = (raw: string) => {
    setRawSearch(raw);
    requestAnimationFrame(() => {
      const cleaned = raw.replaceAll(' ', '');

      if (search === cleaned) {
        return;
      }

      const valid = idnr(cleaned).status === 'valid';
      const newSearch = valid ? cleaned : skipToken;

      setIsValid(valid);
      setSearch(newSearch);
    });
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = ({ key }) => {
    if (key === 'Escape') {
      setRawSearch('');

      return;
    }

    if (key !== 'Enter') {
      return;
    }

    validate();
  };

  return {
    rawSearch,
    search,
    onRawChange,
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
