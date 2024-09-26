import { SearchResult } from '@app/components/overstyringer/search-result';
import { PartContent, States, StyledContainer } from '@app/components/overstyringer/styled-components';
import { type BaseProps, FieldNames } from '@app/components/overstyringer/types';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { isValidOrgnr } from '@app/domain/orgnr';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useYtelseId } from '@app/hooks/use-ytelse-id';
import {
  useSetAvsenderMutation,
  useSetFullmektigMutation,
  useSetKlagerMutation,
} from '@app/redux/api/overstyringer/overstyringer';
import { useGetPartWithUtsendingskanalQuery } from '@app/redux/api/part';
import type { SearchPartWithUtsendingskanalParams } from '@app/redux/api/registreringer/param-types';
import type { IPart } from '@app/types/common';
import { Alert, Search } from '@navikt/ds-react';
import { idnr } from '@navikt/fnrvalidator';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useMemo, useState } from 'react';
import { styled } from 'styled-components';

interface Props extends BaseProps {
  exitSearchMode: () => void;
  error?: string;
}

export const PartSearch = (props: Props) => {
  const setAvsender = useSetAvsenderMutation();
  const setFullmektig = useSetFullmektigMutation();
  const setKlager = useSetKlagerMutation();
  const id = useRegistreringId();

  const mutation = useMemo(() => {
    switch (props.partField) {
      case FieldNames.AVSENDER:
        return setAvsender;
      case FieldNames.FULLMEKTIG:
        return setFullmektig;
      case FieldNames.KLAGER:
        return setKlager;
    }
  }, [props.partField, setAvsender, setFullmektig, setKlager]);

  const [set, { isLoading }] = mutation;

  const setPart = (part: IPart | null) => set({ id, part });

  return <PartSearchInternal {...props} setPart={setPart} isSaving={isLoading} />;
};

interface InternalProps extends Props {
  setPart: (part: IPart | null) => void;
  isSaving: boolean;
}

const PartSearchInternal = ({
  part,
  partField,
  label,
  exitSearchMode,
  icon,
  error: validationError,
  setPart,
  isSaving,
  excludedPartIds = [],
}: InternalProps) => {
  const { mulighet } = useMulighet();
  const [rawSearch, setSearch] = useState('');
  const search = rawSearch.replaceAll(' ', '');
  const [error, setError] = useState<string>();
  const ytelseId = useYtelseId();

  const isValid = useMemo(() => idnr(search).status === 'valid' || isValidOrgnr(search), [search]);

  const searchParams = useMemo<SearchPartWithUtsendingskanalParams | typeof skipToken>(() => {
    if (!isValid || mulighet === undefined || ytelseId === null) {
      return skipToken;
    }

    return {
      identifikator: search,
      sakenGjelderId: mulighet.sakenGjelder.id,
      ytelseId,
    };
  }, [isValid, mulighet, ytelseId, search]);

  const { data, isLoading, isSuccess } = useGetPartWithUtsendingskanalQuery(searchParams);

  const validate = () => setError(isValid ? undefined : 'Ugyldig ID-nummer');

  const setPartAndClose = (p: IPart | null) => {
    setPart(p);
    exitSearchMode();
  };

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
      setPartAndClose(data);
    }
  };

  const isPartInvalid = data !== undefined && data !== null && excludedPartIds.includes(data.id);

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

        {isPartInvalid ? (
          <Alert variant="warning" size="small" inline>
            Er du sikker på at du har valgt riktig?
          </Alert>
        ) : null}

        <SearchResult
          isLoading={isLoading}
          setPart={setPartAndClose}
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

const StyledPartSearch = styled.div`
  display: flex;
  flex-direction: row;
  row-gap: 8px;
  align-items: flex-start;
`;
