import { HStack, VStack } from '@navikt/ds-react';
import type { ComponentProps } from 'react';

export enum AddressState {
  SAVED = 0,
  OVERRIDDEN = 1,
  UNSAVED = 2,
}

const getBackgroundClass = (state: AddressState): string => {
  switch (state) {
    case AddressState.SAVED:
      return 'bg-transparent';
    case AddressState.OVERRIDDEN:
      return 'bg-ax-bg-meta-purple-soft';
    case AddressState.UNSAVED:
      return 'bg-ax-bg-warning-soft';
  }
};

interface ContainerProps extends ComponentProps<'div'> {
  state: AddressState;
}

export const Container = ({ state, className = '', ...props }: ContainerProps) => (
  <VStack
    gap="space-8"
    justify="center"
    className={`relative min-h-8 p-2 ${getBackgroundClass(state)} ${className}`}
    {...props}
  />
);

const RECEIVER_CLASSES = 'border border-ax-border-neutral-subtle border-l-4 rounded mb-2 last:mb-0';

interface StyledReceiverProps extends ComponentProps<'section'> {}

export const StyledReceiver = ({ className = '', ...props }: StyledReceiverProps) => (
  <VStack as="section" className={`${RECEIVER_CLASSES} ${className}`} {...props} />
);

interface StyledReceiverLiProps {
  children?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

export const StyledReceiverLi = ({ className = '', children, ...props }: StyledReceiverLiProps) => (
  <VStack as="li" className={`${RECEIVER_CLASSES} ${className}`} {...props}>
    {children}
  </VStack>
);

interface RowProps extends ComponentProps<'div'> {}

export const Row = ({ className = '', ...props }: RowProps) => (
  <HStack align="center" gap="space-4" className={className} {...props} />
);

interface FieldLabelProps extends ComponentProps<'span'> {}

export const FieldLabel = ({ className = '', ...props }: FieldLabelProps) => (
  <HStack as="span" align="center" gap="space-4" minHeight="24px" className={className} {...props} />
);
