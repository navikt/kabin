import { parseDate } from '@app/functions/date';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useJournalpostFromMulighet } from '@app/hooks/use-journalpost';
import { useRegistrering } from '@app/hooks/use-registrering';
import { SaksTypeEnum } from '@app/types/common';
import type { IAnkemulighetAfter2027 } from '@app/types/mulighet';
import { Button, HStack, LocalAlert } from '@navikt/ds-react';
import { isBefore } from 'date-fns';
import { useState } from 'react';

const useIsOldAnke = (mulighet: IAnkemulighetAfter2027 | undefined) => {
  const { typeId } = useRegistrering();

  if (typeId !== SaksTypeEnum.ANKE_AFTER_2027) {
    return false;
  }

  if (mulighet === undefined || mulighet.vedtakDate === null) {
    return false;
  }

  if (isBefore(parseDate(mulighet.vedtakDate), parseDate('2027-01-01'))) {
    return true;
  }

  return false;
};

interface Props {
  ankemulighet: IAnkemulighetAfter2027 | undefined;
}

export const OldAnkemulighetWarning = ({ ankemulighet }: Props) => {
  const isOldAnke = useIsOldAnke(ankemulighet);
  const canEdit = useCanEdit();

  if (!isOldAnke || !canEdit) {
    return null;
  }

  return <WarningMessage id={ankemulighet?.id} />;
};

interface WarningMessageProps {
  id: string | undefined;
}

const WarningMessage = ({ id }: WarningMessageProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [shownFor, setShownFor] = useState(id);

  if (id !== shownFor) {
    setShownFor(id);
    setIsOpen(true);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <LocalAlert status="warning" size="small" className="w-fit">
      <LocalAlert.Header>
        <LocalAlert.Title>Advarsel</LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>
        <HStack gap="space-16" align="center">
          Du har valgt at anken gjelder et vedtak før 1. januar 2027. Er du sikker på at du har valgt riktig?
          <Button variant="secondary" size="small" onClick={() => setIsOpen(false)}>
            Lukk
          </Button>
        </HStack>
      </LocalAlert.Content>
    </LocalAlert>
  );
};

export const OldJournalpostWarning = () => {
  const { mulighetIsBasedOnJournalpost } = useRegistrering();
  const { data, isSuccess } = useJournalpostFromMulighet();
  const canEdit = useCanEdit();

  if (!mulighetIsBasedOnJournalpost || !isSuccess || !canEdit) {
    return null;
  }

  if (isBefore(parseDate(data.datoOpprettet), parseDate('2027-01-01'))) {
    return <WarningMessage id={data.journalpostId} />;
  }

  return null;
};
