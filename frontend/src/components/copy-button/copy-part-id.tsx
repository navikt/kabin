import { CopyButton } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { formatId } from '@app/functions/format-id';

interface Props {
  id: string | null;
}

export const CopyPartIdButton = ({ id }: Props) => {
  if (id === null) {
    return null;
  }

  return <StyledCopyButton copyText={id} size="small" title="Kopier" text={formatId(id)} />;
};

export const StyledCopyButton = styled(CopyButton)`
  border: 2px solid var(--a-border-default);
  white-space: nowrap;
  align-self: flex-start;
`;
