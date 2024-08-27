import { Detail, Heading } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { IApiErrorReponse } from '@app/components/footer/error-type-guard';

interface Props {
  error: IApiErrorReponse;
}

export const ErrorDetails = ({ error }: Props) => (
  <section>
    <Heading size="xsmall">Teknisk feil</Heading>
    <Details label="Tittel">{error.title}</Details>
    <Details label="Status">{error.status}</Details>
    <Details label="Type">{error.type}</Details>
    <Details label="Instans">{error.instance}</Details>
    <Details label="Detaljer">{error.detail}</Details>
  </section>
);

interface DetailProps {
  children?: string | number;
  label: string;
}

const Details = ({ label, children }: DetailProps) => {
  if (typeof children === 'undefined') {
    return null;
  }

  return (
    <Detail>
      <DetailLabel>{label}:</DetailLabel> <StyledCode>{children}</StyledCode>
    </Detail>
  );
};

const DetailLabel = styled.span`
  font-weight: bold;
`;

const StyledCode = styled.code`
  font-size: 12px;
  line-break: anywhere;
`;
