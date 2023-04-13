import { Search } from '@navikt/ds-react';
import { idnr } from '@navikt/fnrvalidator';
import React, { useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import { SearchResult } from '@app/components/overstyringer/search-result';
import { StyledContainer, getState } from '@app/components/overstyringer/styled-components';
import { GridArea } from '@app/components/overstyringer/types';
import { getFullName } from '@app/domain/name';
import { isValidOrgnr } from '@app/domain/orgnr';
import { ValidationFieldNames } from '@app/hooks/use-field-name';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { useSearchPart } from '@app/simple-api-state/use-api';
import { IPart, IdType, skipToken } from '@app/types/common';
import { IAvsenderMottaker } from '@app/types/dokument';

interface Props {
  exitEditMode: () => void;
  label: string;
  icon: React.ReactNode;
}

export const AvsenderWrite = ({ label, exitEditMode, icon }: Props) => {
  const { journalpost, updatePayload, type } = useContext(ApiContext);
  const validationError = useValidationError(ValidationFieldNames.AVSENDER);
  const [rawSearch, setSearch] = useState('');
  const search = rawSearch.replaceAll(' ', '');
  const [error, setError] = useState<string>();

  const isValid = useMemo(() => idnr(search).status === 'valid' || isValidOrgnr(search), [search]);

  const { data, isLoading } = useSearchPart(isValid ? search : skipToken);

  const validate = () => setError(isValid ? undefined : 'Ugyldig ID-nummer');

  if (type === Type.NONE || journalpost === null) {
    return null;
  }

  const setAvsender = (avsender: IAvsenderMottaker | null) => updatePayload({ overstyringer: { avsender } });

  const setPartAndClose = (p: IPart | null) => {
    if (p === null) {
      setAvsender(null);
    } else if (p.person !== null) {
      setAvsender({
        type: IdType.FNR,
        id: p.person.foedselsnummer,
        navn: getFullName(p.person.navn),
      });
    } else if (p.virksomhet !== null) {
      setAvsender({
        type: IdType.ORGNR,
        id: p.virksomhet.virksomhetsnummer,
        navn: p.virksomhet.navn,
      });
    }

    exitEditMode();
  };

  const onChange = (value: string) => {
    setError(undefined);
    setSearch(value);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = ({ key }) => {
    if (key === 'Escape') {
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
    <StyledContainer $gridArea={GridArea.AVSENDER} $state={getState(journalpost.avsenderMottaker, validationError)}>
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
          data={data}
          label="Sett avsender"
          searchString={search}
          isValid={isValid}
          dismiss={exitEditMode}
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
