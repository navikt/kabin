import { Alert, Heading, Select, Skeleton, Tag } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { styled } from 'styled-components';
import { YtelseTag } from '@app/components/read-only-info/read-only-info';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useYtelseId } from '@app/hooks/use-ytelse-id';
import { useGetTemaYtelserQuery } from '@app/redux/api/kodeverk';
import { useSetYtelseIdMutation } from '@app/redux/api/overstyringer/overstyringer';
import { SaksTypeEnum } from '@app/types/common';
import { FagsystemId } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';

export const Ytelse = () => {
  const { typeId, mulighet } = useMulighet();
  const canEdit = useCanEdit();

  if (typeId === null) {
    return null;
  }

  if (!canEdit) {
    return <ReadOnly />;
  }

  if (typeId === SaksTypeEnum.ANKE) {
    if (mulighet === undefined) {
      return <LoadingYtelse />;
    }

    if (mulighet.currentFagsystemId === FagsystemId.KABAL) {
      return <PredefinedYtelse ytelseId={mulighet.ytelseId} />;
    }
  }

  return <CustomYtelse />;
};

const HEADING = (
  <Heading level="1" size="xsmall" spacing>
    Ytelse
  </Heading>
);

const ReadOnly = () => {
  const ytelseId = useYtelseId();

  return (
    <Container>
      {HEADING}
      {ytelseId === null ? (
        <Tag variant="neutral" size="medium">
          Ikke satt
        </Tag>
      ) : (
        <YtelseTag ytelseId={ytelseId} />
      )}
    </Container>
  );
};

const LoadingYtelse = () => (
  <Container>
    {HEADING}
    <Skeleton variant="rounded" width={500} height={32} />
  </Container>
);

interface PredefinedYtelseProps {
  ytelseId: string | null;
}

const PredefinedYtelse = ({ ytelseId }: PredefinedYtelseProps) => (
  <Container>
    {HEADING}
    {ytelseId === null ? (
      <Alert variant="error" size="small" inline>
        Teknisk feil: Ytelse mangler. Kontakt Team Klage.
      </Alert>
    ) : (
      <YtelseTag ytelseId={ytelseId} />
    )}
  </Container>
);

const CustomYtelse = () => {
  const { id } = useRegistrering();
  const ytelseId = useYtelseId();
  const { mulighet } = useMulighet();
  const [setYtelseId] = useSetYtelseIdMutation();
  const tema = mulighet?.temaId ?? skipToken;
  const { data: ytelser = [] } = useGetTemaYtelserQuery(tema);

  const error = useValidationError(ValidationFieldNames.YTELSE_ID);

  const [onlyYtelse] = ytelser;

  if (ytelser.length === 1 && onlyYtelse !== undefined) {
    return (
      <Container>
        <Heading level="1" size="xsmall" spacing>
          Ytelse
        </Heading>
        <YtelseTag ytelseId={onlyYtelse.id} />
      </Container>
    );
  }

  const options = ytelser.map((ytelse) => (
    <option key={ytelse.id} value={ytelse.id}>
      {ytelse.navn}
    </option>
  ));

  return (
    <Container>
      {HEADING}
      <StyledSelect
        error={error}
        label="Ytelse"
        hideLabel
        size="small"
        onChange={({ target }) => setYtelseId({ id, ytelseId: target.value })}
        value={ytelseId ?? NONE_SELECTED}
        id={ValidationFieldNames.YTELSE_ID}
      >
        <NoneOption value={ytelseId} />
        {options}
      </StyledSelect>
    </Container>
  );
};

const NONE_SELECTED = 'NONE_SELECTED';

const NoneOption = ({ value }: { value: string | null | undefined }) =>
  value === null || value === undefined ? <option value={NONE_SELECTED}>Ingen valgt</option> : null;

const StyledSelect = styled(Select)`
  height: 32px;
`;

const Container = styled.section`
  grid-column: 1;
`;
