import { parseDate } from '@app/functions/date';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useJournalpostFromMulighet } from '@app/hooks/use-journalpost';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetFeatureToggleQuery } from '@app/redux/api/feature-toggles';
import type { IAnkemulighet, IAnkemulighetAfter2027 } from '@app/types/mulighet';
import { LocalAlert } from '@navikt/ds-react';
import { isBefore } from 'date-fns';
import { useState } from 'react';

const START_OF_2027 = parseDate('2027-01-01');
const FAKE_ANKE_BEFORE_2027_MULIGHET_END_DATE = parseDate('2026-06-06');

const isTooOldAnke = (date: string | undefined | null) => {
  if (date === undefined || date === null) {
    return false;
  }

  return isBefore(parseDate(date), START_OF_2027);
};

const useIsTooNewAnke = (date: string | undefined | null) => {
  const { data } = useGetFeatureToggleQuery('kabin-fake-date-constraint');

  if (date === undefined || date === null) {
    return false;
  }

  const endDate = data?.enabled === true ? FAKE_ANKE_BEFORE_2027_MULIGHET_END_DATE : START_OF_2027;

  return !isBefore(parseDate(date), endDate);
};

export const AnkemulighetWarningForAnkeAfter2027 = ({ mulighet }: { mulighet: IAnkemulighetAfter2027 | undefined }) => {
  const isTooOld = isTooOldAnke(mulighet?.vedtakDate);
  const canEdit = useCanEdit();

  if (!isTooOld || !canEdit) {
    return null;
  }

  return <WarningMessage id={mulighet?.id}>{OLD_ANKE_WARNING_MESSAGE}</WarningMessage>;
};

export const AnkemulighetWarningForAnkeBefore2027 = ({ mulighet }: { mulighet: IAnkemulighet | undefined }) => {
  const isTooNew = useIsTooNewAnke(mulighet?.vedtakDate);
  const canEdit = useCanEdit();

  if (!isTooNew || !canEdit) {
    return null;
  }

  return <WarningMessage id={mulighet?.id}>{NEW_ANKE_WARNING_MESSAGE}</WarningMessage>;
};

interface WarningMessageProps {
  id: string | undefined;
  children: string;
}

const WarningMessage = ({ id, children }: WarningMessageProps) => {
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
        <LocalAlert.CloseButton onClick={() => setIsOpen(false)} />
      </LocalAlert.Header>
      <LocalAlert.Content>{children}</LocalAlert.Content>
    </LocalAlert>
  );
};

export const JournalpostForAnkeAfter2027Warning = () => {
  const { mulighetIsBasedOnJournalpost } = useRegistrering();
  const { data, isSuccess } = useJournalpostFromMulighet();
  const canEdit = useCanEdit();

  if (!mulighetIsBasedOnJournalpost || !isSuccess || !canEdit) {
    return null;
  }

  if (isTooOldAnke(data?.datoOpprettet)) {
    return <WarningMessage id={data.journalpostId}>{OLD_ANKE_WARNING_MESSAGE}</WarningMessage>;
  }

  return null;
};

export const JournalpostForAnkeBefore2027Warning = () => {
  const { mulighetIsBasedOnJournalpost } = useRegistrering();
  const { data, isSuccess } = useJournalpostFromMulighet();
  const isTooNew = useIsTooNewAnke(data?.datoOpprettet);
  const canEdit = useCanEdit();

  if (!mulighetIsBasedOnJournalpost || !isSuccess || !canEdit) {
    return null;
  }

  if (isTooNew) {
    return <WarningMessage id={data.journalpostId}>{NEW_ANKE_WARNING_MESSAGE}</WarningMessage>;
  }

  return null;
};

const OLD_ANKE_WARNING_MESSAGE =
  'Du har valgt at anken gjelder et vedtak før 1. januar 2027. Er du sikker på at du har valgt riktig?';

const NEW_ANKE_WARNING_MESSAGE =
  'Du har valgt at anken gjelder et vedtak etter 1. januar 2027. Er du sikker på at du har valgt riktig?';
