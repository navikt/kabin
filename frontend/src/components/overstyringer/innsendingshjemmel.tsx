import { Alert, Heading, Label, Select, Tag } from '@navikt/ds-react';
import React, { useContext, useMemo } from 'react';
import { styled } from 'styled-components';
import { useHjemmelName } from '@app/hooks/kodeverk';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { useLatestYtelser } from '@app/simple-api-state/use-kodeverk';
import { ValidationFieldNames } from '@app/types/validation';

const NONE_SELECTED = 'NONE_SELECTED';

const NoneOption = ({ value }: { value: string | null | undefined }) =>
  value === null || value === undefined ? <option value={NONE_SELECTED}>Ingen valgt</option> : null;

export const Innsendingshjemmel = () => {
  const { data = [] } = useLatestYtelser();
  const { updatePayload, payload, type } = useContext(ApiContext);
  const error = useValidationError(ValidationFieldNames.HJEMMEL_ID_LIST);

  const ytelseId = payload?.overstyringer.ytelseId;

  const options = useMemo(() => {
    if (type === Type.NONE || ytelseId === null) {
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

  if (type === Type.NONE) {
    return null;
  }

  if (type === Type.ANKE && payload.mulighet !== null && payload.mulighet.hjemmelId !== null) {
    return (
      <ReadOnlyContainer>
        <Heading level="1" size="xsmall" spacing>
          Hjemmel
        </Heading>
        <HjemmelTag hjemmelId={payload.mulighet.hjemmelId} />
      </ReadOnlyContainer>
    );
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

  const hjemmel = payload.overstyringer.hjemmelId;

  return (
    <StyledSelect
      label="Hjemmel"
      size="small"
      value={hjemmel ?? NONE_SELECTED}
      onChange={(e) => updatePayload({ overstyringer: { hjemmelId: e.target.value } })}
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

interface SelectProps {
  $gridColumn: number;
}

const StyledSelect = styled(Select)<SelectProps>`
  grid-column: ${({ $gridColumn }) => $gridColumn};
`;

const NoHjemmelOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  grid-column: 2;
`;

const HjemmelTag = ({ hjemmelId }: { hjemmelId: string }) => {
  const hjemmelName = useHjemmelName(hjemmelId);

  return (
    <Tag variant="info" size="medium" title="Hentet fra kildesystem">
      {hjemmelName}
    </Tag>
  );
};

const ReadOnlyContainer = styled.section`
  grid-column: 2;
`;
