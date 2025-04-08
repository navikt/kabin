import { Lookup } from '@app/components/svarbrev/part/lookup';
import { cleanAndValidate } from '@app/components/svarbrev/part/validate';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useLazyGetPartWithUtsendingskanalQuery } from '@app/redux/api/part';
import type { IPart } from '@app/types/common';
import { Search, Tag } from '@navikt/ds-react';
import { useState } from 'react';
import { styled } from 'styled-components';

interface EditPartProps {
  onChange: (part: IPart) => void;
  onClose?: () => void;
  isAdding: boolean;
  buttonText?: string;
  autoFocus?: boolean;
  id?: string;
}

export const EditPart = ({ onChange, isAdding, buttonText, autoFocus, onClose, id }: EditPartProps) => {
  const { mulighet } = useMulighet();
  const [rawValue, setRawValue] = useState('');
  const [error, setError] = useState<string>();
  const [searchPart, { data, isFetching }] = useLazyGetPartWithUtsendingskanalQuery();

  const onClick = () => {
    const [identifikator, err] = cleanAndValidate(rawValue);

    setError(err);

    if (err === undefined) {
      search(identifikator);
    }
  };

  const search = (identifikator: string) => {
    const sakenGjelderId = mulighet?.sakenGjelder.identifikator;

    if (sakenGjelderId === undefined) {
      return setError('Saken gjelder er ikke satt');
    }

    const ytelseId = mulighet?.temaId;

    if (ytelseId === undefined) {
      return setError('Ytelse er ikke satt');
    }

    searchPart({ identifikator, sakenGjelderId, ytelseId });
  };

  const onChangeInput = (value: string) => {
    setRawValue(value);
    const [identifikator, err] = cleanAndValidate(value);

    if (err === undefined) {
      search(identifikator);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (data === undefined || data === null) {
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

  return (
    <StyledEditPart id={id}>
      <Search
        label="Søk"
        size="small"
        value={rawValue}
        onChange={onChangeInput}
        error={error}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        autoComplete="off"
      >
        <Search.Button onClick={onClick} loading={isFetching} />
      </Search>
      <Result
        part={data}
        search={rawValue}
        onChange={(p) => {
          setRawValue('');
          onChange(p);
        }}
        isLoading={isAdding}
        isSearching={isFetching}
        buttonText={buttonText}
      />
    </StyledEditPart>
  );
};

interface ResultProps {
  part: IPart | null | undefined;
  onChange: (part: IPart) => void;
  isLoading: boolean;
  isSearching: boolean;
  search: string;
  buttonText?: string;
}

const Result = ({ part, onChange, search, isLoading, isSearching, buttonText }: ResultProps) => {
  if (part === null) {
    return <Tag variant="warning">Ingen treff</Tag>;
  }

  if (part === undefined) {
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
