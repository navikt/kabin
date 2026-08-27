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
  const { data: journalpost, isSuccess } = useJournalpost();
  const isUploadedDocuments = useIsUploadedDocuments();

  if (mulighet === undefined || mulighet === null) {
    return null;
  }

  const date = getMulighetDate(mulighet);

  if (date === null) {
    return null;
  }

  // The journalpost has not loaded yet, so there is nothing to compare with. Uploaded documents
  // have no journalpost to load, so the query is skipped and never succeeds - the date is
  // validated against today instead, see `isValidMulighetDate`.
  if (!isUploadedDocuments && !isSuccess) {
    return null;
  }

  if (isValidMulighetDate(date, isUploadedDocuments, journalpost?.datoOpprettet)) {
    return null;
  }

  return <Alert variant="error">{getInvalidMulighetDateMessage(mulighet, isUploadedDocuments)}.</Alert>;
};
