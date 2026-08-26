import { describe, expect, it } from 'bun:test';
import { isValidMulighetDate } from '@app/components/muligheter/common/is-valid-mulighet-date';
import { FORMAT } from '@app/domain/date-formats';
import { addDays, format, subDays } from 'date-fns';

const TODAY = format(new Date(), FORMAT);
const YESTERDAY = format(subDays(new Date(), 1), FORMAT);
const TOMORROW = format(addDays(new Date(), 1), FORMAT);

describe('isValidMulighetDate', () => {
  it('is valid when the mulighet has no date', () => {
    expect.assertions(2);

    expect(isValidMulighetDate(null, true, undefined)).toBe(true);
    expect(isValidMulighetDate(null, false, undefined)).toBe(true);
  });

  describe('uploaded documents', () => {
    it('is valid when the date is today or earlier', () => {
      expect.assertions(2);

      expect(isValidMulighetDate(TODAY, true, undefined)).toBe(true);
      expect(isValidMulighetDate(YESTERDAY, true, undefined)).toBe(true);
    });

    it('is invalid when the date is in the future', () => {
      expect.assertions(1);

      expect(isValidMulighetDate(TOMORROW, true, undefined)).toBe(false);
    });
  });

  describe('journalpost', () => {
    it('is valid when the date is not after the journalpost date', () => {
      expect.assertions(2);

      expect(isValidMulighetDate('2022-01-01', false, '2022-01-01')).toBe(true);
      expect(isValidMulighetDate('2021-12-31', false, '2022-01-01')).toBe(true);
    });

    it('is invalid when the date is after the journalpost date', () => {
      expect.assertions(1);

      expect(isValidMulighetDate('2022-01-02', false, '2022-01-01')).toBe(false);
    });

    it('ignores the timestamp of the journalpost date', () => {
      expect.assertions(1);

      expect(isValidMulighetDate('2022-01-01', false, '2022-01-01T00:00:00.000Z')).toBe(true);
    });

    it('is invalid while the journalpost is loading', () => {
      expect.assertions(1);

      expect(isValidMulighetDate('2022-01-01', false, undefined)).toBe(false);
    });
  });
});
