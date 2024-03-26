import { idnr } from '@navikt/fnrvalidator';
import { useEffect, useState } from 'react';
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
  const [rawSearch, setRawSearch] = useState<string>('');
  const [search, setSearch] = useState<string | typeof skipToken>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { data: person = null, isLoading } = useSearchPart(isValid ? search : skipToken);

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
