import { formatId } from '@app/functions/format-id';
import { CopyButton, type CopyButtonProps } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  id: string | null;
  size?: CopyButtonProps['size'];
}

export const CopyPartIdButton = ({ id, size = 'small' }: Props) => {
  if (id === null) {
    return null;
  }

  return (
    <StyledCopyButton
      copyText={id}
      size={size}
      title="Kopier"
      text={formatId(id)}
      onClick={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    />
  );
};

export const StyledCopyButton = styled(CopyButton)`
  border: 2px solid var(--a-border-default);
  white-space: nowrap;
  align-self: flex-start;
`;
