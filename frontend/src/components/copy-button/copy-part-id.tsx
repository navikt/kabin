import { CopyToClipboard } from '@navikt/ds-react-internal';
import React from 'react';
import styled from 'styled-components';
import { formatId } from '@app/functions/format-id';

interface Props {
  id: string | null;
}

export const CopyPartIdButton = ({ id }: Props) => {
  if (id === null) {
    return null;
  }

  return (
    <StyledCopyButton copyText={id} size="small" title="Kopier" popoverText="Kopiert" iconPosition="right">
      {formatId(id)}
    </StyledCopyButton>
  );
};

export const StyledCopyButton = styled(CopyToClipboard)`
  border: 1px solid var(--a-blue-400);
  white-space: nowrap;
`;
