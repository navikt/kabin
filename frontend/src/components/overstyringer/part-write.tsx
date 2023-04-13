import { Search } from '@navikt/ds-react';
import { idnr } from '@navikt/fnrvalidator';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { isValidOrgnr } from '@app/domain/orgnr';
import { useSearchPart } from '@app/simple-api-state/use-api';
import { IPart, skipToken } from '@app/types/common';
import { SearchResult } from './search-result';
import { States, StyledContainer } from './styled-components';
import { BaseProps, PartSearchProps } from './types';

interface ExtraProps {
  exitEditMode: () => void;
}

export type PartWriteProps = BaseProps & PartSearchProps;

export const PartWrite = (props: PartWriteProps & ExtraProps) => {
  const { part, setPart, label, gridArea, exitEditMode, icon } = props;
  const [rawSearch, setSearch] = useState('');
  const search = rawSearch.replaceAll(' ', '');
  const [error, setError] = useState<string>();

  const isValid = useMemo(() => idnr(search).status === 'valid' || isValidOrgnr(search), [search]);

  const { data, isLoading } = useSearchPart(isValid ? search : skipToken);

  const validate = () => setError(isValid ? undefined : 'Ugyldig ID-nummer');

  const setPartAndClose = (p: IPart | null) => {
    setPart(p);
    exitEditMode();
  };

  const onChange = (value: string) => {
    setError(undefined);
    setSearch(value);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = ({ key }) => {
    if (key === 'Escape') {
      exitEditMode();

      return;
    }

    if (key !== 'Enter') {
      return;
    }

    validate();

    if (isValid && !isLoading && data !== undefined) {
      setPartAndClose(data);
    }
  };

  return (
    <StyledContainer $gridArea={gridArea} $state={part === null ? States.UNSET : States.SET}>
      {icon}
      <Content>
        <StyledPartSearch>
          <Search
            label={label}
            placeholder="Søk på ID-nummer"
            value={rawSearch}
            onChange={onChange}
            size="small"
            variant="simple"
            hideLabel={false}
            error={error}
            onKeyDown={onKeyDown}
            autoFocus
          />
        </StyledPartSearch>
        <SearchResult
          isLoading={isLoading}
          setPart={setPartAndClose}
          dismiss={exitEditMode}
          data={data}
          label={label}
          searchString={search}
          isValid={isValid}
        />
      </Content>
    </StyledContainer>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 8px;
  flex-grow: 1;
`;

const StyledPartSearch = styled.div`
  display: flex;
  flex-direction: row;
  row-gap: 8px;
  align-items: flex-start;
`;
