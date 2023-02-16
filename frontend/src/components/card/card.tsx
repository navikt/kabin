import { Heading, HeadingProps } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  title?: string;
  fullHeight?: boolean;
  className?: string;
  titleSize?: HeadingProps['size'];
}

export const Card = ({ children, title, fullHeight = false, className, titleSize = 'small' }: Props) => (
  <StyledSection $fullHeight={fullHeight} className={className}>
    {typeof title === 'string' && title.length > 0 ? (
      <Heading size={titleSize} level="1">
        {title}
      </Heading>
    ) : null}
    {children}
  </StyledSection>
);

interface StyledSectionProps {
  $fullHeight: boolean;
}

const StyledSection = styled.section<StyledSectionProps>`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  height: ${({ $fullHeight }) => ($fullHeight ? '100%' : 'auto')};
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 16px;
`;
