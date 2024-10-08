import { Heading, type HeadingProps } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props extends CardContentProps {
  className?: string;
  labelledBy?: string;
  id?: string;
}

export const Card = ({ className, labelledBy, id, ...cardContentProps }: Props) => (
  <StyledCard className={className} aria-label={cardContentProps.title} aria-labelledby={labelledBy} id={id}>
    <CardContent {...cardContentProps} />
  </StyledCard>
);

export const CardSmall = ({ className, labelledBy, id, ...cardContentProps }: Props) => (
  <StyledSmallCard className={className} aria-label={cardContentProps.title} aria-labelledby={labelledBy} id={id}>
    <CardContent {...cardContentProps} />
  </StyledSmallCard>
);

export const CardMedium = ({ className, labelledBy, id, ...cardContentProps }: Props) => (
  <StyledMediumCard className={className} aria-label={cardContentProps.title} aria-labelledby={labelledBy} id={id}>
    <CardContent {...cardContentProps} />
  </StyledMediumCard>
);

export const CardLarge = ({ className, labelledBy, id, ...cardContentProps }: Props) => (
  <StyledLargeCard className={className} aria-label={cardContentProps.title} aria-labelledby={labelledBy} id={id}>
    <CardContent {...cardContentProps} />
  </StyledLargeCard>
);

export const CardFullHeight = ({ className, labelledBy, id, ...cardContentProps }: Props) => (
  <StyledFullHeightCard className={className} aria-label={cardContentProps.title} aria-labelledby={labelledBy} id={id}>
    <CardContent {...cardContentProps} />
  </StyledFullHeightCard>
);

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

const StyledCard = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  box-shadow: var(--a-shadow-medium);
  border-radius: 4px;
  padding: 16px;
  flex-shrink: 0;
`;

const StyledSmallCard = styled(StyledCard)`
  height: 300px;
`;

const StyledMediumCard = styled(StyledCard)`
  height: 500px;
`;

const StyledLargeCard = styled(StyledCard)`
  min-height: 560px;
`;

const StyledFullHeightCard = styled(StyledCard)`
  height: 100%;
`;
