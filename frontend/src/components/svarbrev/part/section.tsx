import { Label } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';

interface Props {
  label?: string;
  children: React.ReactNode;
  testid?: string;
}

export const Section = ({ label, children, testid }: Props) => {
  if (typeof label === 'undefined') {
    return <StyledSection data-testid={testid}>{children}</StyledSection>;
  }

  const id = 'section-' + label.toLowerCase().replaceAll(/\s/g, '-');

  return (
    <StyledSection data-testid={testid}>
      <Label htmlFor={id} size="small">
        {label}
      </Label>
      <div id={id}>{children}</div>
    </StyledSection>
  );
};

const StyledSection = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  white-space: break-spaces;
`;
