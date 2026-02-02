import { Box, Heading, type HeadingProps, VStack } from '@navikt/ds-react';

interface Props extends CardContentProps {
  className?: string;
  labelledBy?: string;
  id?: string;
}

interface CardWrapperProps extends Props {
  height?: string;
  minHeight?: string;
}

const CardWrapper = ({ className = '', labelledBy, id, height, minHeight, ...cardContentProps }: CardWrapperProps) => (
  <VStack asChild gap="space-16" flexShrink="0" className={className} style={{ height, minHeight }}>
    <Box
      as="section"
      shadow="dialog"
      borderRadius="4"
      padding="space-16"
      aria-label={cardContentProps.title}
      aria-labelledby={labelledBy}
      id={id}
    >
      <CardContent {...cardContentProps} />
    </Box>
  </VStack>
);

export const Card = (props: Props) => <CardWrapper {...props} />;

export const CardSmall = (props: Props) => <CardWrapper {...props} height="300px" />;

export const CardMedium = (props: Props) => <CardWrapper {...props} height="500px" />;

export const CardLarge = (props: Props) => <CardWrapper {...props} minHeight="560px" />;

export const CardFullHeight = (props: Props) => <CardWrapper {...props} height="100%" />;

interface CardContentProps {
  children: React.ReactNode;
  title?: string;
  titleSize?: HeadingProps['size'];
}

const CardContent = ({ title, children, titleSize = 'small' }: CardContentProps) => {
  if (typeof title === 'string' && title.length > 0) {
    return (
      <>
        <Heading size={titleSize} level="1">
          {title}
        </Heading>
        {children}
      </>
    );
  }

  return <>{children}</>;
};
