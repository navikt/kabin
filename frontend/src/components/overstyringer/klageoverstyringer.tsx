import { Alert, Label, Select } from '@navikt/ds-react';
import React, { useContext, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { usePrevious } from '@app/hooks/use-previous';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { useLatestYtelser, useTemaYtelser } from '@app/simple-api-state/use-kodeverk';
import { skipToken } from '@app/types/common';
import { IYtelserLatest } from '@app/types/kodeverk';
import { ValidationFieldNames } from '@app/types/validation';

export const Klageoverstyringer = () => {
  const { type } = useContext(ApiContext);

  if (type !== Type.KLAGE) {
    return null;
  }

  return (
    <>
      <Ytelse />
      <Innsendingshjemmel />
    </>
  );
};

const NONE_SELECTED = 'NONE_SELECTED';

const NoneOption = ({ value }: { value: string | null | undefined }) =>
  value === null || value === undefined ? <option value={NONE_SELECTED}>Ingen valgt</option> : null;

const Ytelse = () => {
  const { payload, updatePayload, type } = useContext(ApiContext);
  const tema = (type === Type.KLAGE ? payload?.mulighet?.temaId : null) ?? skipToken;
  const { data = [], isLoading, isUninitialized } = useTemaYtelser(tema);

  const prevData = usePrevious(data);

  const error = useValidationError(ValidationFieldNames.YTELSE_ID);

  useEffect(() => {
    const [first] = data;

    if (
      type !== Type.KLAGE ||
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

  if (type !== Type.KLAGE) {
    return null;
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

const Innsendingshjemmel = () => {
  const { data = [] } = useLatestYtelser();
  const { updatePayload, payload, type } = useContext(ApiContext);
  const error = useValidationError(ValidationFieldNames.HJEMMEL_ID_LIST);

  const ytelseId = type === Type.KLAGE ? payload?.overstyringer.ytelseId : null;

  const options = useMemo(() => {
    if (type !== Type.KLAGE || ytelseId === null) {
      return [];
    }

    return (
      data
        .find(({ id }) => id === ytelseId)
        ?.innsendingshjemler.map(({ id, beskrivelse }) => (
          <option key={id} value={id}>
            {beskrivelse}
          </option>
        )) ?? []
    );
  }, [data, type, ytelseId]);

  if (type !== Type.KLAGE) {
    return null;
  }

  if (options.length === 0) {
    const message = ytelseId === null ? 'Velg ytelse.' : 'Valgt ytelse har ingen hjemler.';

    return (
      <NoHjemmelOptionsContainer>
        <Label size="small">Hjemmel</Label>
        <Alert variant="info" size="small" inline>
          {message}
        </Alert>
      </NoHjemmelOptionsContainer>
    );
  }

  const hjemmel = payload?.overstyringer.hjemmelIdList[0];

  return (
    <StyledSelect
      label="Hjemmel"
      size="small"
      value={hjemmel ?? NONE_SELECTED}
      onChange={(e) => updatePayload({ overstyringer: { hjemmelIdList: [e.target.value] } })}
      error={error}
      id={ValidationFieldNames.HJEMMEL_ID_LIST}
      disabled={ytelseId === null}
      $gridColumn={2}
    >
      <NoneOption value={hjemmel} />
      {options}
    </StyledSelect>
  );
};

const NoHjemmelOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  grid-column: 2;
`;

interface SelectProps {
  $gridColumn: number;
}

const StyledSelect = styled(Select)<SelectProps>`
  grid-column: ${({ $gridColumn }) => $gridColumn};
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
