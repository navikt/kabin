import { VStack } from '@navikt/ds-react';

interface ContainerProps {
  className?: string;
  children?: React.ReactNode;
}

export const Container = ({ className = '', children }: ContainerProps) => (
  <VStack gap="space-8" flexGrow="1" className={`whitespace-nowrap ${className}`}>
    {children}
  </VStack>
);
