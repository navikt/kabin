import { parseDate } from '@app/functions/date';
import { isAfter, isPast } from 'date-fns';

/**
 * A mulighet is valid when its date is not after the date of the documents it will be registered on.
 *
 * @param date The relevant date of the mulighet, or `null` when the mulighet has no date to validate.
 * @param isUploadedDocuments See `useIsUploadedDocuments`. There is no journalpost to compare with,
 * so the date is validated against today instead.
 * @param journalpostDate `datoOpprettet` of the journalpost, or `undefined` while it is loading.
 */
export const isValidMulighetDate = (
  date: string | null,
  isUploadedDocuments: boolean,
  journalpostDate: string | undefined,
): boolean => {
  if (date === null) {
    return true;
  }

  if (isUploadedDocuments) {
    return isPast(parseDate(date));
  }

  if (journalpostDate === undefined) {
    return false;
  }

  return !isAfter(parseDate(date), parseDate(journalpostDate));
};
