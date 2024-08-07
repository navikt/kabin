import { Alert, Label, Tag, TagProps } from '@navikt/ds-react';
import { useContext, useMemo } from 'react';
import { styled } from 'styled-components';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { useHjemmelName } from '@app/hooks/kodeverk';
import { useValidationError } from '@app/hooks/use-validation-error';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';
import { useLatestYtelser } from '@app/simple-api-state/use-kodeverk';
import { ValidationFieldNames } from '@app/types/validation';

export const Innsendingshjemmel = () => {
  const { data = [] } = useLatestYtelser();
  const { updateState, state, type } = useContext(AppContext);
  const error = useValidationError(ValidationFieldNames.HJEMMEL_ID_LIST);

  const ytelseId = state?.overstyringer.ytelseId;

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

  if (options.length === 0) {
    return (
      <NoHjemmelOptionsContainer>
        <Label size="small">Hjemler</Label>
        <Alert variant="info" size="small" inline>
          {ytelseId === null ? 'Velg ytelse.' : 'Valgt ytelse har ingen hjemler.'}
        </Alert>
      </NoHjemmelOptionsContainer>
    );
  }

  return (
    <StyledFilterDropdown
      label="Hjemler"
      options={options}
      selected={state.overstyringer.hjemmelIdList}
      onChange={(hjemmelIdList) => updateState({ overstyringer: { hjemmelIdList } })}
      error={error}
      id={ValidationFieldNames.HJEMMEL_ID_LIST}
      disabled={ytelseId === null}
    >
      <HjemlerContainer>
        {state.overstyringer.hjemmelIdList.map((id) => (
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
