import { getSakspartNameAndId } from '@app/domain/name';
import { formatFoedselsnummer } from '@app/functions/format-id';
import type { ISimplePart } from '@app/types/common';
import { Loader, Tag, type TagProps } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  person: ISimplePart | undefined;
}

const SIZE: TagProps['size'] = 'medium';

export const PersonDetails = ({ person }: Props) => {
  if (person === undefined) {
    return (
      <StyledTag variant="alt3" size={SIZE}>
        <Loader size="small" /> Laster...
      </StyledTag>
    );
  }

  const navn = getSakspartNameAndId(person);

  if (navn === null) {
    return (
      <StyledTag variant="warning" size={SIZE}>
        Ingen treff på &quot;{formatFoedselsnummer(person?.id)}&quot;
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
