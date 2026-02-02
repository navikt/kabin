import { Card } from '@app/components/card/card';
import { BodyShort, HStack, Loader, type LoaderProps, VStack } from '@navikt/ds-react';
import type { ComponentProps, CSSProperties } from 'react';

interface StyledCardProps extends Omit<ComponentProps<typeof Card>, 'style'> {
  gridArea: string;
  style?: CSSProperties;
}

export const StyledCard = ({ gridArea, className = '', style, ...props }: StyledCardProps) => (
  <div className="overflow-hidden bg-ax-bg-default" style={{ gridArea, ...style }}>
    <Card className={className} {...props} />
  </div>
);

interface StyledPartProps {
  className?: string;
  children?: React.ReactNode;
}

export const StyledPart = ({ className = '', children }: StyledPartProps) => (
  <HStack align="center" gap="space-8" asChild>
    <BodyShort className={className}>{children}</BodyShort>
  </HStack>
);

interface DataContainerProps {
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
}

export const DataContainer = ({ className = '', style, children, ...props }: DataContainerProps) => (
  <section
    className={`mx-auto grid w-250 gap-6 ${className}`}
    style={{
      gridTemplateAreas: "'journalpost case' 'svarbrev-metadata mulighet' 'svarbrev-pdf svarbrev-pdf'",
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: 'repeat(4, min-content)',
      ...style,
    }}
    {...props}
  >
    {children}
  </section>
);

interface LoadingContainerProps {
  className?: string;
  children?: React.ReactNode;
}

export const LoadingContainer = ({ className = '', ...props }: LoadingContainerProps) => (
  <VStack gap="space-24" marginInline="auto" className={`w-250 ${className}`} {...props} />
);

interface StyledLoaderProps extends LoaderProps {}

export const StyledLoader = ({ className = '', ...props }: StyledLoaderProps) => (
  <Loader className={`self-center ${className}`} {...props} />
);
