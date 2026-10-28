import { HStack } from '@navikt/ds-react';

interface PlaceholderProps {
  className?: string;
  children?: React.ReactNode;
}

export const Placeholder = ({ className = '', children }: PlaceholderProps) => (
  <HStack
    align="center"
    justify="center"
    wrap={false}
    height="100%"
    width="100%"
    flexGrow="1"
    padding="space-32"
    className={`text-ax-border-neutral-subtle text-[200px] ${className}`}
  >
    {children}
  </HStack>
);
