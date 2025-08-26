import { getSakspartNameAndId } from '@app/domain/name';
import { formatFoedselsnummer } from '@app/functions/format-id';
import { useGetPartQuery } from '@app/redux/api/part';
import { HStack, Loader, Tag, type TagProps } from '@navikt/ds-react';

const SIZE: TagProps['size'] = 'medium';

interface Props {
  sakenGjelderValue: string;
  id?: string;
  variant?: TagProps['variant'];
}

export const PersonDetails = ({ sakenGjelderValue, id, variant = 'alt3' }: Props) => {
  const { data, isFetching, isSuccess } = useGetPartQuery(sakenGjelderValue);

  if (isFetching) {
    return (
      <StyledTag variant="neutral" size={SIZE} id={id}>
        <Loader size="small" /> Laster...
      </StyledTag>
    );
  }

  if (!isSuccess) {
    return null;
  }

  if (data === null) {
    return (
      <StyledTag variant="warning" size={SIZE} id={id}>
        Ukjent
      </StyledTag>
    );
  }

  const navn = getSakspartNameAndId(data);

  if (navn === null) {
    return (
      <StyledTag variant="warning" size={SIZE} id={id}>
        Ingen treff på &quot;{formatFoedselsnummer(data?.identifikator)}&quot;
      </StyledTag>
    );
  }

  return (
    <StyledTag variant={variant} size={SIZE} id={id}>
      {navn}
    </StyledTag>
  );
};

const StyledTag = (props: TagProps) => (
  <HStack as={Tag} {...props} align="center" justify="center" gap="2" wrap={false} className="whitespace-nowrap" />
);
