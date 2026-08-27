import { describe, expect, it } from 'bun:test';
import {
  type AnkemulighetDates,
  type BegjæringOmGjenopptakMulighetDates,
  getInvalidMulighetDateMessage,
  getMulighetDate,
  getMulighetDateLabel,
  isValidMulighetDate,
  type KlagemulighetDates,
  type OmgjøringskravmulighetDates,
} from '@app/components/muligheter/common/mulighet-date';
import { FORMAT } from '@app/domain/date-formats';
import { SaksTypeEnum } from '@app/types/common';
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

const vedtakDate = '2022-01-01';
const kjennelseMottatt = '2023-02-02';

const KLAGE: KlagemulighetDates = { vedtakDate, mulighetTypeId: SaksTypeEnum.KLAGE };
const ANKE: AnkemulighetDates = { vedtakDate, kjennelseMottatt, mulighetTypeId: SaksTypeEnum.ANKE };
const OMGJØRINGSKRAV: OmgjøringskravmulighetDates = {
  vedtakDate,
  kjennelseMottatt,
  mulighetTypeId: SaksTypeEnum.OMGJØRINGSKRAV,
};
const GJENOPPTAK: BegjæringOmGjenopptakMulighetDates = {
  vedtakDate,
  kjennelseMottatt,
  mulighetTypeId: SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK,
};

describe('getMulighetDate', () => {
  it('uses kjennelseMottatt for begjæring om gjenopptak', () => {
    expect.assertions(1);

    expect(getMulighetDate(GJENOPPTAK)).toBe('2023-02-02');
  });

  it('uses vedtakDate for every other mulighet, even though they also have a kjennelseMottatt', () => {
    expect.assertions(2);

    expect(getMulighetDate(ANKE)).toBe('2022-01-01');
    expect(getMulighetDate(OMGJØRINGSKRAV)).toBe('2022-01-01');
  });

  it('uses vedtakDate for klage, which has no kjennelseMottatt', () => {
    expect.assertions(1);

    expect(getMulighetDate(KLAGE)).toBe('2022-01-01');
  });

  it('does not fall back to the other date when the relevant one is null', () => {
    expect.assertions(2);

    expect(getMulighetDate({ ...GJENOPPTAK, kjennelseMottatt: null })).toBeNull();
    expect(getMulighetDate({ ...ANKE, vedtakDate: null })).toBeNull();
  });
});

describe('getMulighetDateLabel', () => {
  it('names the date after the kjennelse for begjæring om gjenopptak', () => {
    expect.assertions(1);

    expect(getMulighetDateLabel(GJENOPPTAK)).toBe('Kjennelsesdato');
  });

  it('names the date after the vedtak for every other mulighet', () => {
    expect.assertions(3);

    expect(getMulighetDateLabel(ANKE)).toBe('Vedtaksdato');
    expect(getMulighetDateLabel(OMGJØRINGSKRAV)).toBe('Vedtaksdato');
    expect(getMulighetDateLabel(KLAGE)).toBe('Vedtaksdato');
  });
});

describe('getInvalidMulighetDateMessage', () => {
  it('names the date after the kjennelse for begjæring om gjenopptak', () => {
    expect.assertions(2);

    expect(getInvalidMulighetDateMessage(GJENOPPTAK, false)).toBe(
      'Kjennelsesdato kan ikke være etter dato for valgt journalpost',
    );
    expect(getInvalidMulighetDateMessage(GJENOPPTAK, true)).toBe('Kjennelsesdato kan ikke være frem i tid');
  });

  it('names the date after the vedtak for every other mulighet', () => {
    expect.assertions(2);

    expect(getInvalidMulighetDateMessage(ANKE, false)).toBe(
      'Vedtaksdato kan ikke være etter dato for valgt journalpost',
    );
    expect(getInvalidMulighetDateMessage(OMGJØRINGSKRAV, false)).toBe(
      'Vedtaksdato kan ikke være etter dato for valgt journalpost',
    );
  });

  it('refers to today instead of the journalpost for uploaded documents', () => {
    expect.assertions(1);

    expect(getInvalidMulighetDateMessage(ANKE, true)).toBe('Vedtaksdato kan ikke være frem i tid');
  });
});
