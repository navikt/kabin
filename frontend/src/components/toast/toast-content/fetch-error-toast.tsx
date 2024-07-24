import { Detail, Label } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { toast } from '../store';

export const apiErrorToast = (res: Response, url: string) => {
  const message = (
    <>
      <Label size="small">Uventet feil</Label>
      <Details label="URL">{url}</Details>
      <Details label="Statuskode">{res.status}</Details>
      <Details label="Detaljer">{res.statusText}</Details>
    </>
  );

  toast.error(message);
};

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
  word-break: break-word;
`;
