import { Alert, Link } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { useFieldName } from '../../hooks/use-field-name';
import { useSectionTitle } from '../../hooks/use-section-title';
import { IValidationError, IValidationSection } from './error-type-guard';

interface Props {
  sections: IValidationSection[];
}

export const ValidationSummary = ({ sections }: Props) => {
  if (sections.length === 0) {
    return null;
  }

  const errorMessages = sections.map(({ section, properties }) => (
    <Section section={section} properties={properties} key={section} />
  ));

  return (
    <Alert variant="warning">
      <StyledHeader>Kan ikke fullføre registrering. Dette mangler:</StyledHeader>
      <ValidationSummaryContainer>{errorMessages}</ValidationSummaryContainer>
    </Alert>
  );
};

const Section = ({ properties, section }: IValidationSection) => (
  <StyledSection>
    <SectionTitle>{useSectionTitle(section)}</SectionTitle>
    <StyledFieldList>
      {properties.map((p) => (
        <Field key={`${p.field}-${p.reason}`} {...p} />
      ))}
    </StyledFieldList>
  </StyledSection>
);

const Field = ({ field, reason }: IValidationError) => (
  <li>
    <strong>{`${useFieldName(field)}: `}</strong>
    <InlineLink href={`#${field}`}>{reason}</InlineLink>
  </li>
);

const ValidationSummaryContainer = styled.article`
  margin: 0;
  margin-top: 10px;
  padding: 0;
`;

const StyledFieldList = styled.ul`
  margin: 0;
  padding: 0;
  padding-left: 1em;
`;

const SectionTitle = styled.h1`
  margin: 0;
  font-size: 18px;
`;

const StyledSection = styled.section`
  margin-top: 10px;
`;

const StyledHeader = styled.h3`
  margin-top: 0;
  font-size: 16px;
`;

const InlineLink = styled(Link)`
  display: inline;
`;
