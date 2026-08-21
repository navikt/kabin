import { Alert } from '@app/components/alert/alert';
import { isAfter } from 'date-fns';

interface WarningProps {
  date: Date | undefined;
  threshold: Date | undefined;
}

export const Warning = ({ date, threshold }: WarningProps) => {
  if (date === undefined || threshold === undefined) {
    return null;
  }

  if (isAfter(date, threshold)) {
    return null;
  }

  return (
    <Alert variant="warning" marginBlock="space-8 space-0">
      Du har satt en dato som ligger langt tilbake i tid. Er du sikker på at du har fylt ut riktig dato?
    </Alert>
  );
};
