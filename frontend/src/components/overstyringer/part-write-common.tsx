import { PartContent, States, StyledContainer } from '@app/components/overstyringer/layout';
import { SearchResult } from '@app/components/overstyringer/search-result';
import type { BaseProps, FieldNames } from '@app/components/overstyringer/types';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import type { IPart, ISimplePart } from '@app/types/common';
import { HStack, InlineMessage, Search } from '@navikt/ds-react';
import { useState } from 'react';

type PartQueryResult<T> = {
  isLoading: boolean;
} & ({ isSuccess: true; data: T | null } | { isSuccess: false; data?: T | null });

interface InternalProps<T extends ISimplePart | IPart> extends BaseProps {
  setPart: (part: T | null) => void;
  isSaving: boolean;
  exitSearchMode: () => void;
  error?: string;
  partField: FieldNames;
  query: PartQueryResult<T>;
  rawSearch: string;
  setSearch: (value: string) => void;
  isValid: boolean;
  search: string;
}

export const PartWriteCommon = <T extends ISimplePart | IPart>({
  part,
  partField,
  label,
  exitSearchMode,
  icon,
  error: validationError,
  setPart,
  isSaving,
  query,
  excludedPartIds = [],
  rawSearch,
  setSearch,
  isValid,
  search,
}: InternalProps<T>) => {
  const { data, isLoading, isSuccess } = query;
  const [error, setError] = useState<string>();

  const validate = () => setError(isValid ? undefined : 'Ugyldig ID-nummer');

  const onChange = (value: string) => {
    setError(undefined);
    setSearch(value);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = ({ key }) => {
    if (key === 'Escape') {
      exitSearchMode();

      return;
    }

    if (key !== 'Enter') {
      return;
    }

    validate();

    if (isValid && !isLoading && isSuccess && data !== null) {
      setPart(data);
    }
  };

  const isPartInvalid = data !== undefined && data !== null && excludedPartIds.includes(data.identifikator);

  return (
    <StyledContainer state={part === null ? States.UNSET : States.SET} id={partField}>
      {icon}
      <PartContent>
        <HStack align="start" wrap={false}>
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
        </HStack>

        {isPartInvalid ? (
          <InlineMessage status="warning" size="small">
            Er du sikker på at du har valgt riktig?
          </InlineMessage>
        ) : null}

        <SearchResult
          isLoading={isLoading}
          setPart={setPart}
          dismiss={exitSearchMode}
          data={data}
          label={label}
          searchString={search}
          isValid={isValid}
          isSaving={isSaving}
        />
      </PartContent>
      <ValidationErrorMessage error={validationError} />
    </StyledContainer>
  );
};
