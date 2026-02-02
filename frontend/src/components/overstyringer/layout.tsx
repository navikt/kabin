import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import type { ComponentProps } from 'react';

export enum States {
  SET = 'SET',
  UNSET = 'UNSET',
  ERROR = 'ERROR',
}

export const getState = <T,>(value: T | null, error?: string): States => {
  if (typeof error === 'string' && error.length !== 0) {
    return States.ERROR;
  }

  if (value !== null) {
    return States.SET;
  }

  return States.UNSET;
};

interface ContainerProps {
  state: States;
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

const getBackgroundClass = (state: States): string => {
  switch (state) {
    case States.SET:
      return 'bg-ax-accent-100';
    case States.ERROR:
      return 'bg-ax-bg-danger-soft';
    case States.UNSET:
      return 'bg-ax-neutral-200';
  }
};

const getBorderClass = (state: States): string => {
  switch (state) {
    case States.SET:
      return 'border-ax-accent-300';
    case States.ERROR:
      return 'border-ax-border-danger';
    case States.UNSET:
      return 'border-ax-neutral-500';
  }
};

export const StyledContainer = ({ state, className = '', children, id, ...props }: ContainerProps) => (
  <HStack
    gap="space-8"
    align="start"
    padding="space-16"
    minHeight="181px"
    className={`rounded border ${getBackgroundClass(state)} ${getBorderClass(state)} ${className}`}
    id={id}
    wrap={false}
    {...props}
  >
    {children}
  </HStack>
);

interface StyledPartNameProps {
  className?: string;
  children?: React.ReactNode;
  size?: ComponentProps<typeof BodyShort>['size'];
}

export const StyledPartName = ({ className = '', children, size, ...props }: StyledPartNameProps) => (
  <HStack gap="space-8" align="center" asChild>
    <BodyShort className={className} size={size} {...props}>
      {children}
    </BodyShort>
  </HStack>
);

interface PartContentProps {
  className?: string;
  children?: React.ReactNode;
}

export const PartContent = ({ className = '', ...props }: PartContentProps) => (
  <VStack gap="space-8" justify="start" flexGrow="1" className={className} {...props} />
);

interface PartTextContentProps {
  className?: string;
  children?: React.ReactNode;
}

export const PartTextContent = ({ className = '', ...props }: PartTextContentProps) => (
  <VStack gap="space-8" flexGrow="1" className={className} {...props} />
);

interface PartActionsContainerProps {
  className?: string;
  children?: React.ReactNode;
}

export const PartActionsContainer = ({ className = '', ...props }: PartActionsContainerProps) => (
  <HStack gap="space-8" justify="end" align="end" wrap flexShrink="0" flexGrow="0" className={className} {...props} />
);
