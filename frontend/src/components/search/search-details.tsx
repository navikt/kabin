import { Loader, Tag, TagProps } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { getSakspartNameAndId } from '@app/domain/name';
import { formatFoedselsnummer } from '@app/functions/format-id';
import { ISimplePart, skipToken } from '@app/types/common';

interface Props {
  searchString: string | typeof skipToken;
  person: ISimplePart | null;
  isLoading: boolean;
  isValid: boolean;
  isInitialized: boolean;
}

const SIZE: TagProps['size'] = 'medium';

export const SearchDetails = ({ searchString, person, isLoading, isValid, isInitialized }: Props) => {
  if (!isValid || !isInitialized || searchString === skipToken || searchString.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <StyledTag variant="alt3" size={SIZE}>
        <Loader size="small" /> Søker...
      </StyledTag>
    );
  }

  const navn = getSakspartNameAndId(person);

  if (navn === null) {
    return (
      <StyledTag variant="warning" size={SIZE}>
        Ingen treff på &quot;{formatFoedselsnummer(searchString)}&quot;
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
