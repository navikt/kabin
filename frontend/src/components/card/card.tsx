import { Heading, HeadingProps } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';

interface Props extends CardContentProps {
  className?: string;
}

export const Card = ({ className, ...cardContentProps }: Props) => (
  <StyledCard className={className}>
    <CardContent {...cardContentProps} />
  </StyledCard>
);

export const CardSmall = ({ className, ...cardContentProps }: Props) => (
  <StyledSmallCard className={className}>
    <CardContent {...cardContentProps} />
  </StyledSmallCard>
);

export const CardMedium = ({ className, ...cardContentProps }: Props) => (
  <StyledMediumCard className={className}>
    <CardContent {...cardContentProps} />
  </StyledMediumCard>
);

export const CardLarge = ({ className, ...cardContentProps }: Props) => (
  <StyledLargeCard className={className}>
    <CardContent {...cardContentProps} />
  </StyledLargeCard>
);

export const CardFullHeight = ({ className, ...cardContentProps }: Props) => (
  <StyledFullHeightCard className={className}>
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
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
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
