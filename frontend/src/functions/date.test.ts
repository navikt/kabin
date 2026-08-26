import { describe, expect, it } from 'bun:test';
import { parseDate } from '@app/functions/date';

describe('parseDate', () => {
  it('parses an ISO date as local midnight', () => {
    expect.assertions(1);

    const actual = parseDate('2022-01-01');
    expect(actual).toEqual(new Date(2022, 0, 1));
  });

  it('should ignore timestamp', () => {
    expect.assertions(1);

    const actual = parseDate('2021-01-01T23:59:59.999Z');
    expect(actual).toEqual(new Date(2021, 0, 1));
  });

  it('throws on malformed date', () => {
    expect.assertions(1);

    expect(() => parseDate('01.01.2022')).toThrow('Invalid date: 01.01.2022');
  });

  it('throws on out of range date', () => {
    expect.assertions(1);

    expect(() => parseDate('2022-13-01')).toThrow('Invalid date: 2022-13-01');
  });
});
