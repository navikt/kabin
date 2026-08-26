import { Alert } from '@app/components/alert/alert';
import { isValidMulighetDate } from '@app/components/muligheter/common/is-valid-mulighet-date';
import { useIsUploadedDocuments, useJournalpost } from '@app/hooks/use-journalpost';

interface Props {
  /** The date of the selected mulighet that the documents will be registered on. */
  date: string | null | undefined;
  /** Name of the date, matching the column header in the table. */
  label: string;
}

/** Warns when the already selected mulighet became invalid, typically because the user went back
 * and picked a journalpost that is older than the date of the mulighet. Invalid muligheter cannot
 * be selected in the first place, see `Row`. */
export const Warning = ({ date, label }: Props) => {
  const { journalpost } = useJournalpost();
  const isUploadedDocuments = useIsUploadedDocuments();

  if (date === undefined || date === null) {
    return null;
  }

  // The journalpost has not loaded yet, so there is nothing to compare with.
  if (!isUploadedDocuments && journalpost === undefined) {
    return null;
  }

  if (isValidMulighetDate(date, isUploadedDocuments, journalpost?.datoOpprettet)) {
    return null;
  }

  return (
    <Alert variant="error">
      {isUploadedDocuments
        ? `${label} kan ikke være frem i tid.`
        : `${label} kan ikke være etter dato for valgt journalpost.`}
    </Alert>
  );
};
