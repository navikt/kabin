import { CopyButton, CopyButtonProps } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { formatId } from '@app/functions/format-id';

interface Props {
  id: string | null;
  size?: CopyButtonProps['size'];
}

export const CopyPartIdButton = ({ id, size = 'small' }: Props) => {
  if (id === null) {
    return null;
  }

  return <StyledCopyButton copyText={id} size={size} title="Kopier" text={formatId(id)} />;
};

export const StyledCopyButton = styled(CopyButton)`
  border: 2px solid var(--a-border-default);
  white-space: nowrap;
  align-self: flex-start;
  flex-shrink: 0;
`;
