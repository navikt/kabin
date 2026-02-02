import { formatId } from '@app/functions/format-id';
import { CopyButton, type CopyButtonProps } from '@navikt/ds-react';

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

export const StyledCopyButton = ({ className = '', ...props }: CopyButtonProps) => (
  <CopyButton className={`self-start whitespace-nowrap border-2 border-ax-border-neutral ${className}`} {...props} />
);
