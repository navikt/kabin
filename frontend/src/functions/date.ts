import { FORMAT } from '@app/domain/date-formats';
import { isValid, parse } from 'date-fns';

/**
 * Parses the date part of an ISO date or date-time string, ignoring any timestamp.
 * The result is local midnight, so it can be compared with date-fns functions like `isAfter` and `isPast`.
 *
 * The truncation is required, not just convenience: date-fns `parse` returns an invalid date when the
 * input has trailing characters the format did not consume, so passing a full date-time would fail.
 *
 * @throws if the string does not start with a valid `yyyy-MM-dd` date.
 */
export const parseDate = (date: string): Date => {
  const parsed = parse(date.substring(0, FORMAT.length), FORMAT, new Date());

  if (!isValid(parsed)) {
    throw new Error(`Invalid date: ${date}`);
  }

  return parsed;
};
