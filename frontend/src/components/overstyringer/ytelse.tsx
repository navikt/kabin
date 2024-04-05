import { Alert, Heading, Select, Tag } from '@navikt/ds-react';
import React, { useContext, useEffect } from 'react';
import { styled } from 'styled-components';
import { useYtelseName } from '@app/hooks/kodeverk';
import { usePrevious } from '@app/hooks/use-previous';
import { useValidationError } from '@app/hooks/use-validation-error';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';
import { useTemaYtelser } from '@app/simple-api-state/use-kodeverk';
import { skipToken } from '@app/types/common';
import { IYtelserLatest } from '@app/types/kodeverk';
import { SourceId } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';

const NONE_SELECTED = 'NONE_SELECTED';

const NoneOption = ({ value }: { value: string | null | undefined }) =>
  value === null || value === undefined ? <option value={NONE_SELECTED}>Ingen valgt</option> : null;

export const Ytelse = () => {
  const { state, updateState, type } = useContext(AppContext);
  const tema = state?.mulighet?.temaId ?? skipToken;
  const { data = [], isLoading, isUninitialized } = useTemaYtelser(tema);

  const prevData = usePrevious(data);

  const error = useValidationError(ValidationFieldNames.YTELSE_ID);

  useEffect(() => {
    const [first] = data;

    if (
      type === Type.NONE ||
      isUninitialized ||
      isLoading ||
      data.length !== 1 ||
      first === undefined ||
      first.id === state.overstyringer.ytelseId ||
      areEqual(prevData, data)
    ) {
      return;
    }

    updateState({ overstyringer: { ytelseId: first.id, hjemmelIdList: [] } });
  }, [data, isLoading, isUninitialized, state, prevData, type, updateState]);

  if (type === Type.NONE) {
    return null;
  }

  if (type === Type.ANKE && state.mulighet !== null && state.mulighet.sourceId === SourceId.KABAL) {
    return (
      <ReadOnlyContainer>
        <Heading level="1" size="xsmall" spacing>
          Ytelse
        </Heading>
        {state.mulighet.ytelseId === null ? (
          <Alert variant="error" size="small" inline>
            Teknisk feil: Ytelse mangler. Kontakt Team Klage.
          </Alert>
        ) : (
          <YtelseTag ytelseId={state.mulighet.ytelseId} />
        )}
      </ReadOnlyContainer>
    );
  }

  const options = data.map(({ id, navn }) => (
    <option key={id} value={id}>
      {navn}
    </option>
  ));

  return (
    <StyledSelect
      error={error}
      label="Ytelse"
      size="small"
      onChange={({ target }) => updateState({ overstyringer: { ytelseId: target.value, hjemmelIdList: [] } })}
      value={state.overstyringer.ytelseId ?? NONE_SELECTED}
      id={ValidationFieldNames.YTELSE_ID}
      $gridColumn={1}
    >
      <NoneOption value={state.overstyringer.ytelseId} />
      {options}
    </StyledSelect>
  );
};

interface ElementProps {
  $gridColumn: number;
}

const StyledSelect = styled(Select)<ElementProps>`
  grid-column: ${({ $gridColumn }) => $gridColumn};
`;

interface IYtelseTagProps {
  ytelseId: string;
}

const YtelseTag = ({ ytelseId }: IYtelseTagProps) => {
  const ytelseName = useYtelseName(ytelseId);

  return (
    <Tag variant="info" size="medium" title="Hentet fra kildesystem">
      {ytelseName}
    </Tag>
  );
};

const ReadOnlyContainer = styled.section`
  grid-column: 1;
`;

const areEqual = (prev: IYtelserLatest[] | undefined, current: IYtelserLatest[]) => {
  if (prev === undefined) {
    return false;
  }

  if (prev.length !== current.length) {
    return false;
  }

  return prev.every(({ id }) => current.some((c) => c.id === id));
};
