import { parseDate } from '@app/functions/date';
import { SaksTypeEnum } from '@app/types/common';
import type {
  IAnkemulighet,
  IBegjæringOmGjenopptakMulighet,
  IKlagemulighet,
  IOmgjøringskravmulighet,
} from '@app/types/mulighet';
import { isAfter, isPast } from 'date-fns';

/** The date-carrying subset of every mulighet, derived from the real types so it tracks them.
 * `mulighetTypeId` discriminates, so the switches below are exhaustive. `IAdditionalKabalMulighet`
 * is covered by the `IAnkemulighet` member, since it inherits `SaksTypeEnum.ANKE`. */
export type KlagemulighetDates = Pick<IKlagemulighet, 'mulighetTypeId' | 'vedtakDate'>;
export type AnkemulighetDates = Pick<IAnkemulighet, 'mulighetTypeId' | 'vedtakDate' | 'kjennelseMottatt'>;
export type OmgjøringskravmulighetDates = Pick<
  IOmgjøringskravmulighet,
  'mulighetTypeId' | 'vedtakDate' | 'kjennelseMottatt'
>;
export type BegjæringOmGjenopptakMulighetDates = Pick<
  IBegjæringOmGjenopptakMulighet,
  'mulighetTypeId' | 'vedtakDate' | 'kjennelseMottatt'
>;

export type MulighetDates =
  | KlagemulighetDates
  | AnkemulighetDates
  | OmgjøringskravmulighetDates
  | BegjæringOmGjenopptakMulighetDates;

/**
 * The date of a mulighet that everything else is measured against: the date shown in the table,
 * validated by `isValidMulighetDate` and used as the lower bound for `Mottatt Nav klageinstans`.
 *
 * `null` means the mulighet has no such date, not that it is invalid.
 */
export const getMulighetDate = (mulighet: MulighetDates): string | null => {
  switch (mulighet.mulighetTypeId) {
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK:
      return mulighet.kjennelseMottatt;
    case SaksTypeEnum.ANKE:
    case SaksTypeEnum.OMGJØRINGSKRAV:
    case SaksTypeEnum.KLAGE:
      return mulighet.vedtakDate;
  }
};

/** Names the date returned by `getMulighetDate` the way the table column header does. */
export const getMulighetDateLabel = (mulighet: MulighetDates): string => {
  switch (mulighet.mulighetTypeId) {
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK:
      return KJENNELSESDATO;
    case SaksTypeEnum.ANKE:
    case SaksTypeEnum.OMGJØRINGSKRAV:
    case SaksTypeEnum.KLAGE:
      return VEDTAKSDATO;
  }
};

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
export const getInvalidMulighetDateMessage = (mulighet: MulighetDates, isUploadedDocuments: boolean): string =>
  isUploadedDocuments
    ? `${getMulighetDateLabel(mulighet)} kan ikke være frem i tid`
    : `${getMulighetDateLabel(mulighet)} kan ikke være etter dato for valgt journalpost`;

const VEDTAKSDATO = 'Vedtaksdato';
const KJENNELSESDATO = 'Kjennelsesdato';
