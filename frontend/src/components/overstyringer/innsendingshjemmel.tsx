import { Alert, Heading, Label, Tag, TagProps } from '@navikt/ds-react';
import React, { useContext, useMemo } from 'react';
import { styled } from 'styled-components';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { useHjemmelName } from '@app/hooks/kodeverk';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { useLatestYtelser } from '@app/simple-api-state/use-kodeverk';
import { ValidationFieldNames } from '@app/types/validation';

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
        ?.innsendingshjemler.map(({ id, beskrivelse }) => ({ value: id, label: beskrivelse })) ?? []
    );
  }, [data, type, ytelseId]);

  if (type === Type.NONE) {
    return null;
  }

  if (type === Type.ANKE && payload.mulighet !== null && payload.mulighet.hjemmelIdList !== null) {
    return (
      <ReadOnlyContainer>
        <Heading level="1" size="xsmall" spacing>
          Hjemler
        </Heading>
        <HjemlerContainer>
          {payload.mulighet.hjemmelIdList.map((id) => (
            <HjemmelTag hjemmelId={id} key={id} size="medium" />
          ))}
        </HjemlerContainer>
      </ReadOnlyContainer>
    );
  }

  if (options.length === 0) {
    const message = ytelseId === null ? 'Velg ytelse.' : 'Valgt ytelse har ingen hjemler.';

    return (
      <NoHjemmelOptionsContainer>
        <Label size="small">Hjemler</Label>
        <Alert variant="info" size="small" inline>
          {message}
        </Alert>
      </NoHjemmelOptionsContainer>
    );
  }

  return (
    <StyledFilterDropdown
      label="Hjemler"
      options={options}
      selected={payload.overstyringer.hjemmelIdList}
      onChange={(hjemmelIdList) => updatePayload({ overstyringer: { hjemmelIdList } })}
      error={error}
      id={ValidationFieldNames.HJEMMEL_ID_LIST}
      disabled={ytelseId === null}
    >
      <HjemlerContainer>
        {payload.overstyringer.hjemmelIdList.map((id) => (
          <HjemmelTag hjemmelId={id} key={id} size="small" />
        ))}
      </HjemlerContainer>
    </StyledFilterDropdown>
  );
};

const StyledFilterDropdown = styled(FilterDropdown)`
  grid-column: 2;
`;

const HjemlerContainer = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const NoHjemmelOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  grid-column: 2;
`;

const HjemmelTag = ({ hjemmelId, size }: { hjemmelId: string; size?: TagProps['size'] }) => {
  const hjemmelName = useHjemmelName(hjemmelId);

  return (
    <Tag variant="info" size={size} title="Hentet fra kildesystem">
      {hjemmelName}
    </Tag>
  );
};

const ReadOnlyContainer = styled.section`
  grid-column: 2;
`;
