import { Alert, Label, Select } from '@navikt/ds-react';
import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { useLatestYtelser, useTemaYtelser } from '@app/simple-api-state/use-kodeverk';
import { skipToken } from '@app/types/common';
import { ValidationFieldNames } from '@app/types/validation';

export const Klageoverstyringer = () => {
  const { type } = useContext(ApiContext);

  if (type !== Type.KLAGE) {
    return null;
  }

  return (
    <>
      <Ytelse />
      <Innsendingshjemler />
    </>
  );
};

const NONE_SELECTED = 'NONE_SELECTED';

const NoneOption = ({ value }: { value: string | null }) =>
  value === null ? <option value={NONE_SELECTED}>Ingen valgt</option> : null;

const Ytelse = () => {
  const { payload, updatePayload, type } = useContext(ApiContext);
  const tema = (type === Type.KLAGE ? payload?.mulighet?.temaId : null) ?? skipToken;
  const { data = [] } = useTemaYtelser(tema);
  const error = useValidationError(ValidationFieldNames.YTELSE_ID);

  if (type !== Type.KLAGE) {
    return null;
  }

  const options = data.map(({ id, navn }) => (
    <option key={id} value={id}>
      {navn}
    </option>
  ));

  return (
    <YtelseSelect
      error={error}
      label="Ytelse"
      size="small"
      onChange={({ target }) => updatePayload({ overstyringer: { ytelseId: target.value, hjemmelIdList: [] } })}
      value={payload.overstyringer.ytelseId ?? NONE_SELECTED}
      id={ValidationFieldNames.YTELSE_ID}
    >
      <NoneOption value={payload.overstyringer.ytelseId} />
      {options}
    </YtelseSelect>
  );
};

const YtelseSelect = styled(Select)`
  grid-area: ytelse;
`;

const Innsendingshjemler = () => {
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
        ?.innsendingshjemler.map(({ id, beskrivelse }) => ({ value: id, label: beskrivelse })) ?? []
    );
  }, [data, type, ytelseId]);

  if (type !== Type.KLAGE) {
    return null;
  }

  if (ytelseId !== null && options.length === 0) {
    return (
      <NoOptionsContainer>
        <Label size="small">Hjemler</Label>
        <Alert variant="info" size="small" inline>
          Valgt ytelse har ingen hjemler.
        </Alert>
      </NoOptionsContainer>
    );
  }

  return (
    <StyledInnsendingshjemler
      options={options}
      selected={payload?.overstyringer.hjemmelIdList ?? []}
      onChange={(hjemmelIdList) => updatePayload({ overstyringer: { hjemmelIdList } })}
      disabled={ytelseId === null}
      label="Hjemler"
      direction="up"
      fullWidth
      error={error}
      id={ValidationFieldNames.HJEMMEL_ID_LIST}
    />
  );
};

const StyledInnsendingshjemler = styled(FilterDropdown)`
  grid-area: hjemler;
`;

const NoOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  grid-area: hjemler;
`;
