import { HStack } from '@navikt/ds-react';
import type { ComponentProps } from 'react';

interface StyledBrevmottakerProps extends Omit<ComponentProps<typeof HStack>, 'align' | 'gap' | 'wrap'> {}

export const StyledBrevmottaker = ({ className = '', ...props }: StyledBrevmottakerProps) => (
  <HStack
    align="center"
    gap="space-8"
    wrap={false}
    minHeight="2rem"
    paddingInline="space-8"
    className={className}
    {...props}
  />
);

interface StyledReceiverContentProps extends Omit<ComponentProps<typeof HStack>, 'align' | 'gap'> {}

export const StyledReceiverContent = ({ className = '', ...props }: StyledReceiverContentProps) => (
  <HStack gap="space-4" align="center" className={className} {...props} />
);
