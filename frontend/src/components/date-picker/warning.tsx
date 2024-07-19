import { Alert } from '@navikt/ds-react';
import { isAfter } from 'date-fns';
import { styled } from 'styled-components';

interface WarningProps {
  date: Date | undefined;
  threshhold: Date | undefined;
}

export const Warning = ({ date, threshhold }: WarningProps) => {
  if (date === undefined || threshhold === undefined) {
    return null;
  }

  if (isAfter(date, threshhold)) {
    return null;
  }

  return (
    <StyledAlert variant="warning" size="small">
      Du har satt en dato som ligger langt tilbake i tid. Er du sikker på at du har fylt ut riktig dato?
    </StyledAlert>
  );
};

const StyledAlert = styled(Alert)`
  margin-top: 8px;
`;
