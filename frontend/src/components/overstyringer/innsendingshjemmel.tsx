import { Alert, Label, Tag, TagProps } from '@navikt/ds-react';
import { useMemo } from 'react';
import { styled } from 'styled-components';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { useHjemmelName } from '@app/hooks/kodeverk';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetHjemmelIdListMutation } from '@app/redux/api/overstyringer';
import { useLatestYtelser } from '@app/simple-api-state/use-kodeverk';
import { ValidationFieldNames } from '@app/types/validation';

export const Innsendingshjemmel = () => {
  const registrering = useRegistrering();
  const { data = [] } = useLatestYtelser();
  const { id, typeId } = registrering;
  const { ytelseId, hjemmelIdList } = registrering.overstyringer;
  const [setHjemmelIdList] = useSetHjemmelIdListMutation();

  const error = useValidationError(ValidationFieldNames.HJEMMEL_ID_LIST);

  const options = useMemo(() => {
    if (typeId === null || ytelseId === null) {
      return [];
    }

    return (
      data.find((y) => y.id === ytelseId)?.innsendingshjemler.map((h) => ({ value: h.id, label: h.beskrivelse })) ?? []
    );
  }, [data, typeId, ytelseId]);

  if (typeId === null) {
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
      selected={hjemmelIdList ?? []}
      onChange={(list) => setHjemmelIdList({ id, hjemmelIdList: list })}
      error={error}
      id={ValidationFieldNames.HJEMMEL_ID_LIST}
      disabled={ytelseId === null}
    >
      <HjemlerContainer>
        {hjemmelIdList?.map((h) => <HjemmelTag hjemmelId={h} key={h} size="small" />)}
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
