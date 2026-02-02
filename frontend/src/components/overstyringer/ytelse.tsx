import { YtelseTag } from '@app/components/read-only-info/read-only-info';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useTemaId } from '@app/hooks/use-tema-id';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useYtelseId } from '@app/hooks/use-ytelse-id';
import { useGetTemaYtelserQuery } from '@app/redux/api/kodeverk';
import { useSetYtelseIdMutation } from '@app/redux/api/overstyringer/overstyringer';
import { SaksTypeEnum } from '@app/types/common';
import { FagsystemId } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';
import { Alert, Heading, Select, Skeleton, Tag } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';

const ID = ValidationFieldNames.YTELSE_ID;
const HEADING_ID = 'ytelse-heading';

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
  <Heading level="1" size="xsmall" spacing id={HEADING_ID}>
    Ytelse
  </Heading>
);

const ReadOnly = () => {
  const ytelseId = useYtelseId();

  return (
    <section className="col-[1]" aria-labelledby={HEADING_ID}>
      {HEADING}
      {ytelseId === null ? (
        <Tag data-color="neutral" variant="outline" size="medium" data-testid={ID}>
          Ikke satt
        </Tag>
      ) : (
        <YtelseTag ytelseId={ytelseId} data-testid={ID} />
      )}
    </section>
  );
};

const LoadingYtelse = () => (
  <section className="col-[1]" aria-labelledby={HEADING_ID}>
    {HEADING}
    <Skeleton variant="rounded" width={500} height={32} />
  </section>
);

interface PredefinedYtelseProps {
  ytelseId: string | null;
}

const PredefinedYtelse = ({ ytelseId }: PredefinedYtelseProps) => (
  <section className="col-[1]" aria-labelledby={HEADING_ID}>
    {HEADING}
    {ytelseId === null ? (
      <Alert variant="error" size="small" inline data-testid={ID}>
        Teknisk feil: Ytelse mangler. Kontakt Team Klage.
      </Alert>
    ) : (
      <YtelseTag ytelseId={ytelseId} data-testid={ID} />
    )}
  </section>
);

const CustomYtelse = () => {
  const { id } = useRegistrering();
  const ytelseId = useYtelseId();
  const [setYtelseId] = useSetYtelseIdMutation();
  const tema = useTemaId() ?? skipToken;
  const { data: ytelser = [] } = useGetTemaYtelserQuery(tema);

  const error = useValidationError(ID);

  const [onlyYtelse] = ytelser;

  if (ytelser.length === 1 && onlyYtelse !== undefined) {
    return (
      <section className="col-[1]" aria-labelledby={HEADING_ID}>
        {HEADING}
        <YtelseTag ytelseId={onlyYtelse.id} data-testid={ID} />
      </section>
    );
  }

  const options = ytelser.map((ytelse) => (
    <option key={ytelse.id} value={ytelse.id}>
      {ytelse.navn}
    </option>
  ));

  return (
    <section className="col-[1]" aria-labelledby={HEADING_ID}>
      {HEADING}
      <Select
        className="h-8"
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
      </Select>
    </section>
  );
};

const NONE_SELECTED = 'NONE_SELECTED';

const NoneOption = ({ value }: { value: string | null | undefined }) =>
  value === null || value === undefined ? <option value={NONE_SELECTED}>Ingen valgt</option> : null;
