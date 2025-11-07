import { FORMAT } from '@app/domain/date-formats';
import { isAfter, isEqual, isValid, parse } from 'date-fns';

enum ComparisonResult {
  BEFORE = -1,
  EQUAL = 0,
  AFTER = 1,
}

const compareDates = (a: string, b: string): number => {
  const aParsed = parse(a.substring(0, FORMAT.length), FORMAT, new Date());

  if (!isValid(aParsed)) {
    throw new Error(`Invalid date: ${a}`);
  }

  const bParsed = parse(b.substring(0, FORMAT.length), FORMAT, new Date());

  if (!isValid(bParsed)) {
    throw new Error(`Invalid date: ${b}`);
  }

  if (isEqual(aParsed, bParsed)) {
    return ComparisonResult.EQUAL;
  }

  if (isAfter(aParsed, bParsed)) {
    return ComparisonResult.AFTER;
  }

  return ComparisonResult.BEFORE;
};

export const isDateAfter = (maybeAfter: string, base: string): boolean =>
  compareDates(maybeAfter, base) === ComparisonResult.AFTER;

/** @public */
export const isDateBefore = (maybeBefore: string, base: string): boolean =>
  compareDates(maybeBefore, base) === ComparisonResult.BEFORE;

/** @public */
export const isDateEqual = (maybeEqual: string, base: string): boolean =>
  compareDates(maybeEqual, base) === ComparisonResult.EQUAL;

/** @public */
export const isDateBeforeOrEqual = (maybeBefore: string, base: string): boolean => {
  const comparison = compareDates(maybeBefore, base);

  return comparison === ComparisonResult.BEFORE || comparison === ComparisonResult.EQUAL;
};

/** @public */
export const isDateAfterOrEqual = (maybeAfter: string, base: string): boolean => {
  const comparison = compareDates(maybeAfter, base);

  return comparison === ComparisonResult.AFTER || comparison === ComparisonResult.EQUAL;
};
