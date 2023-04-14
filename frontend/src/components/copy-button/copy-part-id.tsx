import { CopyToClipboard } from '@navikt/ds-react-internal';
import React from 'react';
import styled from 'styled-components';
import { formatId } from '@app/functions/format-id';
import { IAvsenderMottaker, IPart } from '@app/types/common';

interface Props {
  part: IPart | IAvsenderMottaker | null;
}

export const CopyPartIdButton = ({ part }: Props) => {
  if (part === null) {
    return null;
  }

  return (
    <StyledCopyButton copyText={part.id} size="small" title="Kopier" popoverText="Kopiert" iconPosition="right">
      {formatId(part.id)}
    </StyledCopyButton>
  );
};

const StyledCopyButton = styled(CopyToClipboard)`
  border: 1px solid var(--a-blue-400);
  white-space: nowrap;
`;
