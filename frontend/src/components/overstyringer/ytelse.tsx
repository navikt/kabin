import { Alert, Heading, Select, Tag } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useEffect } from 'react';
import { styled } from 'styled-components';
import { useYtelseName } from '@app/hooks/kodeverk';
import { usePrevious } from '@app/hooks/use-previous';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useAppStateStore, useOverstyringerStore } from '@app/pages/create/app-context/state';
import { Type } from '@app/pages/create/app-context/types';
import { useTemaYtelser } from '@app/simple-api-state/use-kodeverk';
import { IKodeverkSimpleValue } from '@app/types/kodeverk';
import { SourceId } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';

const NONE_SELECTED = 'NONE_SELECTED';

const NoneOption = ({ value }: { value: string | null | undefined }) =>
  value === null || value === undefined ? <option value={NONE_SELECTED}>Ingen valgt</option> : null;

export const Ytelse = () => {
  const { type, mulighet } = useAppStateStore();
  const ytelseId = useOverstyringerStore((state) => state.ytelseId);
  const setOverstyringer = useOverstyringerStore((state) => state.setOverstyringer);
  const tema = mulighet?.temaId ?? skipToken;
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
      first.id === ytelseId ||
      areEqual(prevData, data)
    ) {
      return;
    }

    setOverstyringer({ ytelseId: first.id, hjemmelIdList: [] });
  }, [data, isLoading, isUninitialized, prevData, type, setOverstyringer, ytelseId]);

  if (type === Type.NONE) {
    return null;
  }

  if (type === Type.ANKE && mulighet !== null && mulighet.sourceId === SourceId.KABAL) {
    return (
      <ReadOnlyContainer>
        <Heading level="1" size="xsmall" spacing>
          Ytelse
        </Heading>
        {mulighet.ytelseId === null ? (
          <Alert variant="error" size="small" inline>
            Teknisk feil: Ytelse mangler. Kontakt Team Klage.
          </Alert>
        ) : (
          <YtelseTag ytelseId={mulighet.ytelseId} />
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
      onChange={({ target }) => setOverstyringer({ ytelseId: target.value, hjemmelIdList: [] })}
      value={ytelseId ?? NONE_SELECTED}
      id={ValidationFieldNames.YTELSE_ID}
      $gridColumn={1}
    >
      <NoneOption value={ytelseId} />
      {options}
    </StyledSelect>
  );
};

interface ElementProps {
  $gridColumn: number;
}

const StyledSelect = styled(Select) <ElementProps>`
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

const areEqual = (prev: IKodeverkSimpleValue[] | undefined, current: IKodeverkSimpleValue[]) => {
  if (prev === undefined) {
    return false;
  }

  if (prev.length !== current.length) {
    return false;
  }

  return prev.every(({ id }) => current.some((c) => c.id === id));
};
