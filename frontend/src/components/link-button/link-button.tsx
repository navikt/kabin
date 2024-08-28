import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Button, type ButtonProps } from '@navikt/ds-react';

interface Props {
  variant: ButtonProps['variant'];
  size: ButtonProps['size'];
  href: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const ExternalLinkButton = ({ children, ...props }: Props) => (
  <Button
    {...props}
    target="_blank"
    as="a"
    icon={<ExternalLinkIcon aria-hidden role="presentation" title="Ekstern lenke" />}
    onClick={(e) => e.stopPropagation()}
    onKeyDown={(e) => e.stopPropagation()}
  >
    {children}
  </Button>
);
