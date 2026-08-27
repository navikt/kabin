import { Alert } from '@app/components/alert/alert';
import {
  getInvalidMulighetDateMessage,
  getMulighetDate,
  isValidMulighetDate,
} from '@app/components/muligheter/common/mulighet-date';
import { useIsUploadedDocuments, useJournalpost } from '@app/hooks/use-journalpost';
import type { IMulighet } from '@app/types/mulighet';

interface Props {
  /** The already selected mulighet that the documents will be registered on. */
  mulighet: IMulighet | null | undefined;
}

/** Warns when the already selected mulighet became invalid, typically because the user went back
 * and picked a journalpost that is older than the date of the mulighet. Invalid muligheter cannot
 * be selected in the first place, see `Row`. */
export const Warning = ({ mulighet }: Props) => {
  const isUploadedDocuments = useIsUploadedDocuments();

  if (mulighet === undefined || mulighet === null) {
    return null;
  }

  const date = getMulighetDate(mulighet);

  if (date === null) {
    return null;
  }

  return isUploadedDocuments ? (
    <UploadWarning mulighet={mulighet} date={date} />
  ) : (
    <JournalpostWarning mulighet={mulighet} date={date} />
  );
};

interface WarningProps {
  mulighet: IMulighet;
  /** The date of the mulighet to validate, see `getMulighetDate`. */
  date: string;
}

/** The documents are an existing journalpost, so the date of the mulighet is validated against
 * the date of that journalpost. While it loads there is nothing to compare with. */
const JournalpostWarning = ({ mulighet, date }: WarningProps) => {
  const { data: journalpost, isSuccess } = useJournalpost();

  return !isSuccess || isValidMulighetDate(date, false, journalpost.datoOpprettet) ? null : (
    <Alert variant="error">{getInvalidMulighetDateMessage(mulighet, false)}.</Alert>
  );
};

/** Uploaded documents have no journalpost to compare with, so the date of the mulighet is
 * validated against today instead, see `isValidMulighetDate`. */
const UploadWarning = ({ mulighet, date }: WarningProps) =>
  isValidMulighetDate(date, true, undefined) ? null : (
    <Alert variant="error">{getInvalidMulighetDateMessage(mulighet, true)}.</Alert>
  );
