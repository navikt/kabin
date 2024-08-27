import { Alert, Label } from '@navikt/ds-react';
import { useMemo } from 'react';
import { styled } from 'styled-components';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { HjemmelTag, ReadOnlyHjemler } from '@app/components/read-only-info/read-only-info';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useYtelseId } from '@app/hooks/use-ytelse-id';
import { useGetLatestYtelserQuery } from '@app/redux/api/kodeverk';
import { useSetHjemmelIdListMutation } from '@app/redux/api/overstyringer/overstyringer';
import { ValidationFieldNames } from '@app/types/validation';

const ID = ValidationFieldNames.HJEMMEL_ID_LIST;

export const Innsendingshjemler = () => {
  const { id, typeId, overstyringer } = useRegistrering();
  const { data = [] } = useGetLatestYtelserQuery();
  const { hjemmelIdList } = overstyringer;
  const [setHjemmelIdList] = useSetHjemmelIdListMutation();
  const canEdit = useCanEdit();
  const ytelseId = useYtelseId();

  const error = useValidationError(ID);

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

  if (!canEdit) {
    return <ReadOnlyHjemler id={ID} label="hjemler" hjemmelIdList={hjemmelIdList} />;
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
      id={ID}
      disabled={ytelseId === null}
    >
      <HjemlerContainer>{hjemmelIdList?.map((h) => <HjemmelTag hjemmelId={h} key={h} />)}</HjemlerContainer>
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
