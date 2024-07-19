import { Search, Tag } from '@navikt/ds-react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { cleanAndValidate } from '@app/components/svarbrev/part/validate';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { KABAL_API_BASE_PATH } from '@app/simple-api-state/use-api';
import { IPart } from '@app/types/common';
import { Lookup } from './lookup';

interface EditPartProps {
  onChange: (part: IPart) => void;
  onClose?: () => void;
  isLoading: boolean;
  buttonText?: string;
  autoFocus?: boolean;
  id?: string;
}

export const EditPart = ({ onChange, isLoading, buttonText, autoFocus, onClose, id }: EditPartProps) => {
  const { state } = useContext(AppContext);
  const [rawValue, setRawValue] = useState('');
  const [error, setError] = useState<string>();
  const [search, { data, isLoading: isSearching, isFetching, isError, reset }] = useSearchPartWithUtsendingslkanal();

  const sakenGjelderId = state?.mulighet?.sakenGjelder.id;
  const ytelseId = state?.mulighet?.temaId;

  const onClick = () => {
    const [value, inputError] = cleanAndValidate(rawValue);

    setError(inputError);

    if (inputError === undefined && sakenGjelderId !== undefined && ytelseId !== undefined) {
      search({ identifikator: value, sakenGjelderId, ytelseId });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (data === undefined) {
        return;
      }

      onChange(data);
      setRawValue('');

      return;
    }

    if (e.key === 'Escape') {
      onClose?.();
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const [value, inputError] = cleanAndValidate(rawValue);

      setError(undefined);

      if (inputError !== undefined) {
        return reset();
      }

      if (sakenGjelderId !== undefined && ytelseId !== undefined) {
        search({ identifikator: value, sakenGjelderId, ytelseId });
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [rawValue, search, sakenGjelderId, ytelseId, reset]);

  return (
    <StyledEditPart id={id}>
      <Search
        label="Søk"
        size="small"
        value={rawValue}
        onChange={setRawValue}
        error={error}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        autoComplete="off"
        htmlSize={63}
      >
        <Search.Button onClick={onClick} loading={isSearching || isFetching} />
      </Search>
      <Result
        part={data}
        search={rawValue}
        onChange={(p) => {
          setRawValue('');
          onChange(p);
        }}
        isLoading={isLoading}
        isSearching={isSearching || isFetching}
        isError={isError}
        buttonText={buttonText}
      />
    </StyledEditPart>
  );
};

interface ResultProps {
  part: IPart | undefined;
  onChange: (part: IPart) => void;
  isLoading: boolean;
  isSearching: boolean;
  isError: boolean;
  search: string;
  buttonText?: string;
}

const Result = ({ part, onChange, search, isError, isLoading, isSearching, buttonText }: ResultProps) => {
  if (isError) {
    return <Tag variant="warning">Ingen treff</Tag>;
  }

  if (part === undefined || search.length === 0) {
    return null;
  }

  return (
    <Lookup isSearching={isSearching} part={part} onChange={onChange} isLoading={isLoading} buttonText={buttonText} />
  );
};

const StyledEditPart = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

interface SearchPartWithUtsendingskanalParams {
  identifikator: string;
  sakenGjelderId: string;
  ytelseId: string;
}

type SearchResult = [
  (params: SearchPartWithUtsendingskanalParams) => Promise<void>,
  { data: IPart | undefined; isLoading: boolean; isFetching: boolean; isError: boolean; reset: () => void },
];

const useSearchPartWithUtsendingslkanal = (): SearchResult => {
  const [data, setData] = useState<IPart | undefined>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setData(undefined);
    setError(null);
  }, []);

  const search = useCallback(async (params: SearchPartWithUtsendingskanalParams) => {
    setIsFetching(true);

    try {
      const res = await fetch(`${KABAL_API_BASE_PATH}/searchpartwithutsendingskanal`, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401) {
        window.location.assign('/oauth2/login');
        throw new Error('Ikke innlogget');
      }

      if (!res.ok) {
        throw new Error('Failed to fetch');
      }

      setData(await res.json());
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error('Unknown error'));
      }
    } finally {
      setIsFetching(false);
    }
  }, []);

  return [search, { data, isLoading: isFetching && data === undefined, isFetching, isError: error !== null, reset }];
};
