import { CheckmarkIcon } from '@navikt/aksel-icons';
import { CopyButton } from '@navikt/ds-react';
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

  return <StyledCopyButton text={formatId(id)} copyText={id} size="small" activeIcon={<CheckmarkIcon aria-hidden />} />;
};

export const StyledCopyButton = styled(CopyButton)`
  border: 1px solid var(--a-blue-400);
  white-space: nowrap;
  align-self: flex-start;
`;
