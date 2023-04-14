import { Search } from '@navikt/ds-react';
import { idnr } from '@navikt/fnrvalidator';
import React, { useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import { isValidOrgnr } from '@app/domain/orgnr';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { useSearchPart } from '@app/simple-api-state/use-api';
import { IPart, skipToken } from '@app/types/common';
import { SearchResult } from './search-result';
import { PartContent, States, StyledContainer } from './styled-components';
import { BaseProps } from './types';

interface Callback {
  exitEditMode: () => void;
}

export type PartWriteProps = BaseProps;

export const PartWrite = (props: PartWriteProps & Callback) => {
  const { part, partField, label, gridArea, exitEditMode, icon } = props;
  const { type, updatePayload } = useContext(ApiContext);
  const [rawSearch, setSearch] = useState('');
  const search = rawSearch.replaceAll(' ', '');
  const [error, setError] = useState<string>();

  const isValid = useMemo(() => idnr(search).status === 'valid' || isValidOrgnr(search), [search]);

  const { data, isLoading } = useSearchPart(isValid ? search : skipToken);

  if (type === Type.NONE) {
    return null;
  }

  const setPart = (newPart: IPart | null) => updatePayload({ overstyringer: { [partField]: newPart } });

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
      <PartContent>
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
      </PartContent>
    </StyledContainer>
  );
};

const StyledPartSearch = styled.div`
  display: flex;
  flex-direction: row;
  row-gap: 8px;
  align-items: flex-start;
`;
