import { getSakspartNameAndId } from '@app/domain/name';
import { formatFoedselsnummer } from '@app/functions/format-id';
import { useGetPartQuery } from '@app/redux/api/part';
import { Loader, Tag, type TagProps } from '@navikt/ds-react';
import { styled } from 'styled-components';

const SIZE: TagProps['size'] = 'medium';

interface Props {
  sakenGjelderValue: string;
}

export const PersonDetails = ({ sakenGjelderValue }: Props) => {
  const { data, isFetching, isSuccess } = useGetPartQuery(sakenGjelderValue);

  if (isFetching) {
    return (
      <StyledTag variant="alt3" size={SIZE}>
        <Loader size="small" /> Laster...
      </StyledTag>
    );
  }

  if (!isSuccess) {
    return null;
  }

  if (data === null) {
    return (
      <StyledTag variant="warning" size={SIZE}>
        Ukjent
      </StyledTag>
    );
  }

  const navn = getSakspartNameAndId(data);

  if (navn === null) {
    return (
      <StyledTag variant="warning" size={SIZE}>
        Ingen treff på &quot;{formatFoedselsnummer(data?.identifikator)}&quot;
      </StyledTag>
    );
  }

  return (
    <StyledTag variant="alt3" size={SIZE}>
      {navn}
    </StyledTag>
  );
};

const StyledTag = styled(Tag)`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 8px;
  flex-wrap: nowrap;
  white-space: nowrap;
`;
