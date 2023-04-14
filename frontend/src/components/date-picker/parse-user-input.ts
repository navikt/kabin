import { addYears, format, isAfter, isBefore, isValid, parse, subYears } from 'date-fns';
import { PRETTY_FORMAT } from '@app/domain/date-formats';
import { isDateParts, isEightChars, isFourChars, isSixChars } from './guards';

export const parseUserInput = (input: string, fromDate: Date, toDate: Date, centuryThreshold: number): string => {
  const parts = input.split('.');

  // Prefix with reasonable century, e.g. 20 for 2022 and 19 for 1999.
  if (isDateParts(parts)) {
    const [dd, mm, yy] = parts;
    const dateString = `${dd.padStart(2, '0')}.${mm.padStart(2, '0')}.${getFullYear(yy, centuryThreshold)}`;

    return dateString;
  }

  const chars = input.split('');

  // 211220 -> 21.12.2020
  if (isSixChars(chars)) {
    const [d1, d2, m1, m2, y1, y2] = chars;
    const dateString = `${d1}${d2}.${m1}${m2}.${getFullYear(`${y1}${y2}`, centuryThreshold)}`;

    return dateString;
  }

  // 31122020 -> 31.12.2020
  if (isEightChars(chars)) {
    const [d1, d2, m1, m2, y1, y2, y3, y4] = chars;
    const dateString = `${d1}${d2}.${m1}${m2}.${y1}${y2}${y3}${y4}`;

    return dateString;
  }

  // Current year if the date is in the past, otherwise previous year.
  // 3112 -> 31.12.2021
  if (isFourChars(chars)) {
    const [d1, d2, m1, m2] = chars;
    const dateObject = parse(`${d1}${d2}.${m1}${m2}`, 'dd.MM', new Date());

    if (!isValid(dateObject)) {
      return input;
    }

    if (isAfter(dateObject, toDate)) {
      const afterDate = format(subYears(dateObject, 1), PRETTY_FORMAT);

      return afterDate;
    }

    if (isBefore(dateObject, fromDate)) {
      const beforeDate = format(addYears(dateObject, 1), PRETTY_FORMAT);

      return beforeDate;
    }

    return format(dateObject, PRETTY_FORMAT);
  }

  return input;
};

const getFullYear = (year: string, centuryThreshold: number): string => {
  if (year.length === 2) {
    const century = Number.parseInt(year, 10) <= centuryThreshold ? '20' : '19';

    return `${century}${year}`;
  }

  return year;
};
