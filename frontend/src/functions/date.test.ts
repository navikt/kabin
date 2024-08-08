import { describe, expect, it } from 'bun:test';
import { isDateAfter, isDateAfterOrEqual, isDateBefore, isDateBeforeOrEqual, isDateEqual } from '@app/functions/date';

describe('isDate', () => {
  it('before', () => {
    expect.assertions(1);

    const actual = isDateAfter('2022-01-01', '2023-01-01');
    expect(actual).toBe(false);
  });

  it('equal', () => {
    expect.assertions(1);

    const actual = isDateAfter('2022-01-01', '2022-01-01');
    expect(actual).toBe(false);
  });

  it('after', () => {
    expect.assertions(1);

    const actual = isDateAfter('2022-01-01', '2021-01-01');
    expect(actual).toBe(true);
  });

  it('after - should ignore timestamp', () => {
    expect.assertions(1);

    const actual = isDateAfter('2021-01-01T23:59:59.999Z', '2021-01-01');
    expect(actual).toBe(false);
  });
});

describe('isDateBefore', () => {
  it('before', () => {
    expect.assertions(1);

    const actual = isDateBefore('2022-01-01', '2023-01-01');
    expect(actual).toBe(true);
  });

  it('equal', () => {
    expect.assertions(1);

    const actual = isDateBefore('2022-01-01', '2022-01-01');
    expect(actual).toBe(false);
  });

  it('after', () => {
    expect.assertions(1);

    const actual = isDateBefore('2022-01-01', '2021-01-01');
    expect(actual).toBe(false);
  });
});

describe('isDateEqual', () => {
  it('before', () => {
    expect.assertions(1);

    const actual = isDateEqual('2022-01-01', '2023-01-01');
    expect(actual).toBe(false);
  });

  it('equal', () => {
    expect.assertions(1);

    const actual = isDateEqual('2022-01-01', '2022-01-01');
    expect(actual).toBe(true);
  });

  it('after', () => {
    expect.assertions(1);

    const actual = isDateEqual('2022-01-01', '2021-01-01');
    expect(actual).toBe(false);
  });

  it('equal - should ignore timestamp', () => {
    expect.assertions(1);

    const actual = isDateEqual('2021-01-01T23:59:59.999Z', '2021-01-01');
    expect(actual).toBe(true);
  });
});

describe('isDateBeforeOrEqual', () => {
  it('before', () => {
    expect.assertions(1);

    const actual = isDateBeforeOrEqual('2022-01-01', '2023-01-01');
    expect(actual).toBe(true);
  });

  it('equal', () => {
    expect.assertions(1);

    const actual = isDateBeforeOrEqual('2022-01-01', '2022-01-01');
    expect(actual).toBe(true);
  });

  it('after', () => {
    expect.assertions(1);

    const actual = isDateBeforeOrEqual('2022-01-01', '2021-01-01');
    expect(actual).toBe(false);
  });
});

describe('isDateAfterOrEqual', () => {
  it('before', () => {
    expect.assertions(1);

    const actual = isDateAfterOrEqual('2022-01-01', '2023-01-01');
    expect(actual).toBe(false);
  });

  it('equal', () => {
    expect.assertions(1);

    const actual = isDateAfterOrEqual('2022-01-01', '2022-01-01');
    expect(actual).toBe(true);
  });

  it('after', () => {
    expect.assertions(1);

    const actual = isDateAfterOrEqual('2022-01-01', '2021-01-01');
    expect(actual).toBe(true);
  });
});
