import { Heading, Select, Tag } from '@navikt/ds-react';
import React, { useContext, useEffect } from 'react';
import { styled } from 'styled-components';
import { useYtelseName } from '@app/hooks/kodeverk';
import { usePrevious } from '@app/hooks/use-previous';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { useTemaYtelser } from '@app/simple-api-state/use-kodeverk';
import { skipToken } from '@app/types/common';
import { IYtelserLatest } from '@app/types/kodeverk';
import { ValidationFieldNames } from '@app/types/validation';

const NONE_SELECTED = 'NONE_SELECTED';

const NoneOption = ({ value }: { value: string | null | undefined }) =>
  value === null || value === undefined ? <option value={NONE_SELECTED}>Ingen valgt</option> : null;

export const Ytelse = () => {
  const { payload, updatePayload, type } = useContext(ApiContext);
  const tema = payload?.mulighet?.temaId ?? skipToken;
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
      first.id === payload.overstyringer.ytelseId ||
      areEqual(prevData, data)
    ) {
      return;
    }

    updatePayload({ overstyringer: { ytelseId: first.id, hjemmelIdList: [] } });
  }, [data, isLoading, isUninitialized, payload, prevData, type, updatePayload]);

  if (type === Type.NONE) {
    return null;
  }

  if (type === Type.ANKE && payload.mulighet !== null && payload.mulighet.ytelseId !== null) {
    return (
      <ReadOnlyContainer>
        <Heading level="1" size="xsmall" spacing>
          Ytelse
        </Heading>
        <YtelseTag ytelseId={payload.mulighet.ytelseId} />
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
      onChange={({ target }) => updatePayload({ overstyringer: { ytelseId: target.value, hjemmelIdList: [] } })}
      value={payload.overstyringer.ytelseId ?? NONE_SELECTED}
      id={ValidationFieldNames.YTELSE_ID}
      $gridColumn={1}
    >
      <NoneOption value={payload.overstyringer.ytelseId} />
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
