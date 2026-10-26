import { getSakspartNameAndId } from '@app/domain/name';
import { formatFoedselsnummer } from '@app/functions/format-id';
import { useGetPartQuery } from '@app/redux/api/part';
import { HStack, Loader, Tag, type TagProps } from '@navikt/ds-react';

const SIZE: TagProps['size'] = 'medium';

interface Props {
  sakenGjelderValue: string;
  id?: string;
  'data-color'?: TagProps['data-color'];
}

export const PersonDetails = ({ sakenGjelderValue, id, 'data-color': color = 'info' }: Props) => {
  const { data, isFetching, isSuccess } = useGetPartQuery(sakenGjelderValue);

  if (isFetching) {
    return (
      <StyledTag data-color="neutral" size={SIZE} id={id}>
        <Loader size="small" /> Laster...
      </StyledTag>
    );
  }

  if (!isSuccess) {
    return null;
  }

  if (data === null) {
    return (
      <StyledTag data-color="warning" size={SIZE} id={id}>
        Ukjent
      </StyledTag>
    );
  }

  const navn = getSakspartNameAndId(data);

  if (navn === null) {
    return (
      <StyledTag data-color="warning" size={SIZE} id={id}>
        Ingen treff på &quot;{formatFoedselsnummer(data?.identifikator)}&quot;
      </StyledTag>
    );
  }

  return (
    <StyledTag data-color={color} size={SIZE} id={id}>
      {navn}
    </StyledTag>
  );
};

const StyledTag = (props: Omit<TagProps, 'variant'>) => (
  <HStack
    as={Tag}
    variant="outline"
    {...props}
    align="center"
    justify="center"
    gap="space-8"
    wrap={false}
    className="whitespace-nowrap"
  />
);
