import { isDateAfter } from './date';

describe('isDateAfter', () => {
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
});
