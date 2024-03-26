import { BodyShort, Label, Loader, TextField } from '@navikt/ds-react';
import React, { useCallback, useContext } from 'react';
import { styled } from 'styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { useValidationError } from '@app/hooks/use-validation-error';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';
import { useCalculateFristdato } from '@app/simple-api-state/use-api';
import { skipToken } from '@app/types/common';
import { ValidationFieldNames } from '@app/types/validation';

export const EditFrist = () => {
  const { type, state, updateState } = useContext(AppContext);
  const error = useValidationError(ValidationFieldNames.FRIST);

  const parseAndSet = useCallback(
    (value: string): void => {
      const parsed = Number.parseInt(value, 10);

      if (!Number.isNaN(parsed) && parsed >= 0 && type !== Type.NONE) {
        updateState({ overstyringer: { fristInWeeks: parsed } });
      }
    },
    [type, updateState],
  );

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) => parseAndSet(target.value),
    [parseAndSet],
  );

  if (type === Type.NONE) {
    return null;
  }

  return (
    <StyledEditFrist>
      <StyledTextField
        type="number"
        label="Frist i uker"
        size="small"
        min={0}
        id={ValidationFieldNames.FRIST}
        value={state.overstyringer.fristInWeeks ?? 12}
        onChange={onInputChange}
        error={error}
      />
      <Fristdato />
    </StyledEditFrist>
  );
};

const Fristdato = () => {
  const { type, state } = useContext(AppContext);

  const params =
    type === Type.NONE || state.overstyringer.mottattKlageinstans === null || state.overstyringer.fristInWeeks === null
      ? skipToken
      : { fromDate: state.overstyringer.mottattKlageinstans, fristInWeeks: state.overstyringer.fristInWeeks };

  const { data: fristdato, isLoading } = useCalculateFristdato(params);

  if (type === Type.NONE) {
    return null;
  }

  return (
    <StyledFristdato>
      <Label size="small">Beregnet fristdato</Label>
      {isLoading ? (
        <Loader size="xsmall" />
      ) : (
        <BodyShort as="time" dateTime={fristdato}>
          {isoDateToPretty(fristdato) ?? '-'}
        </BodyShort>
      )}
    </StyledFristdato>
  );
};

const StyledTextField = styled(TextField)`
  grid-area: frist;
  width: 100px;
`;

const StyledEditFrist = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: flex-start;
`;

const StyledFristdato = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
