import { Alert, Heading, Select, Tag } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { styled } from 'styled-components';
import { useYtelseName } from '@app/hooks/kodeverk';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetYtelseIdMutation } from '@app/redux/api/overstyringer';
import { useTemaYtelser } from '@app/simple-api-state/use-kodeverk';
import { SaksTypeEnum } from '@app/types/common';
import { SourceId } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';

const NONE_SELECTED = 'NONE_SELECTED';

const NoneOption = ({ value }: { value: string | null | undefined }) =>
  value === null || value === undefined ? <option value={NONE_SELECTED}>Ingen valgt</option> : null;

export const Ytelse = () => {
  const registrering = useRegistrering();
  const { id } = registrering;
  const { typeId, mulighet } = useMulighet();
  const { ytelseId } = registrering.overstyringer;
  const [setYtelseId] = useSetYtelseIdMutation();
  const tema = mulighet?.temaId ?? skipToken;
  const { data: ytelser = [] } = useTemaYtelser(tema);

  const error = useValidationError(ValidationFieldNames.YTELSE_ID);

  if (typeId === null) {
    return null;
  }

  if (typeId === SaksTypeEnum.ANKE && mulighet !== undefined && mulighet.fagsystemId === SourceId.KABAL) {
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

  const options = ytelser.map((ytelse) => (
    <option key={ytelse.id} value={ytelse.id}>
      {ytelse.navn}
    </option>
  ));

  return (
    <StyledSelect
      error={error}
      label="Ytelse"
      size="small"
      onChange={({ target }) => setYtelseId({ id, ytelseId: target.value })}
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
