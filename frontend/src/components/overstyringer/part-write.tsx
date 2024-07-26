import { Search } from '@navikt/ds-react';
import { idnr } from '@navikt/fnrvalidator';
import { useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { isValidOrgnr } from '@app/domain/orgnr';
import { useAppStateStore, useOverstyringerStore } from '@app/pages/create/app-context/state';
import { Type } from '@app/pages/create/app-context/types';
import { SearchPartWithAddressParams, useSearchPartWithAddress } from '@app/simple-api-state/use-api';
import { IPart, skipToken } from '@app/types/common';
import { SearchResult } from './search-result';
import { PartContent, States, StyledContainer } from './styled-components';
import { BaseProps } from './types';

interface InternalProps {
  exitEditMode: () => void;
  error?: string;
}

export type PartWriteProps = BaseProps;

export const PartWrite = ({
  part,
  partField,
  label,
  exitEditMode,
  icon,
  error: validationError,
}: PartWriteProps & InternalProps) => {
  const { type, mulighet } = useAppStateStore();
  const ytelseId = useOverstyringerStore((state) => state.ytelseId);
  const setOverstyringer = useOverstyringerStore((state) => state.setOverstyringer);
  const [rawSearch, setSearch] = useState('');
  const search = rawSearch.replaceAll(' ', '');
  const [error, setError] = useState<string>();

  const isValid = useMemo(() => idnr(search).status === 'valid' || isValidOrgnr(search), [search]);

  const searchParams = useMemo<SearchPartWithAddressParams | typeof skipToken>(() => {
    if (!isValid || mulighet === null || ytelseId === null) {
      return skipToken;
    }

    return {
      identifikator: search,
      sakenGjelderId: mulighet.sakenGjelder.id,
      ytelseId,
    };
  }, [isValid, mulighet, ytelseId, search]);

  const { data, isLoading } = useSearchPartWithAddress(searchParams);

  if (type === Type.NONE) {
    return null;
  }

  const setPart = (newPart: IPart | null) => setOverstyringer({ [partField]: newPart });

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
    <StyledContainer $state={part === null ? States.UNSET : States.SET} id={partField}>
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
            id={partField}
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
      <ValidationErrorMessage error={validationError} />
    </StyledContainer>
  );
};

const StyledPartSearch = styled.div`
  display: flex;
  flex-direction: row;
  row-gap: 8px;
  align-items: flex-start;
`;
