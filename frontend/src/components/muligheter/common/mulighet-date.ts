import { MulighetType } from '@app/components/muligheter/common/table/types';
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

/** Explains why a mulighet is rejected by `isValidMulighetDate`. */
export const getInvalidMulighetDateMessage = (type: MulighetType, isUploadedDocuments: boolean): string =>
  isUploadedDocuments
    ? `${getDateLabel(type)} kan ikke være frem i tid`
    : `${getDateLabel(type)} kan ikke være etter dato for valgt journalpost`;

/** Names the date the way the table column header does. */
const getDateLabel = (type: MulighetType): string => {
  switch (type) {
    case MulighetType.BEGJÆRING_OM_GJENOPPTAK:
      return 'Kjennelsesdato';
    case MulighetType.ADDITIONAL_KABAL_MULIGHET:
    case MulighetType.ANKE:
    case MulighetType.KLAGE:
    case MulighetType.OMGJØRINGSKRAV:
      return 'Vedtaksdato';
  }
};
