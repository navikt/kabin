import { describe, expect, it } from 'bun:test';
import {
  createAppendedSortIndex,
  getSortIndexBetween,
  MAX_DOKUMENTER,
  SORT_INDEX_GAP,
  SORT_INDEX_MAX,
  SORT_INDEX_MIN,
} from '@app/domain/sort-index';

describe('sort-index', () => {
  describe('SORT_INDEX_GAP', () => {
    it('should leave enough room for MAX_DOKUMENTER documents without overflowing', () => {
      expect.assertions(1);

      expect(SORT_INDEX_GAP * MAX_DOKUMENTER).toBeLessThanOrEqual(SORT_INDEX_MAX);
    });
  });

  describe('SORT_INDEX_MIN', () => {
    it('should be the smallest safe integer', () => {
      expect.assertions(1);

      expect(SORT_INDEX_MIN).toBe(Number.MIN_SAFE_INTEGER);
    });
  });

  describe('SORT_INDEX_MAX', () => {
    it('should be the largest safe integer', () => {
      expect.assertions(1);

      expect(SORT_INDEX_MAX).toBe(Number.MAX_SAFE_INTEGER);
    });
  });

  describe('createAppendedSortIndex', () => {
    it('should give the very first document sortIndex 0', () => {
      expect.assertions(1);

      expect(createAppendedSortIndex([], 1)(0)).toBe(0);
    });

    it('should evenly space a first batch from 0 and upwards', () => {
      expect.assertions(3);

      const getSortIndex = createAppendedSortIndex([], 3);

      expect(getSortIndex(0)).toBe(0);
      expect(getSortIndex(1)).toBe(SORT_INDEX_GAP);
      expect(getSortIndex(2)).toBe(SORT_INDEX_GAP * 2);
    });

    it('should append a single document a full gap above the highest sortIndex', () => {
      expect.assertions(1);

      expect(createAppendedSortIndex([1500, 500], 1)(0)).toBe(1500 + SORT_INDEX_GAP);
    });

    it('should evenly space a batch above the highest sortIndex', () => {
      expect.assertions(2);

      const getSortIndex = createAppendedSortIndex([500, 1500], 2);

      expect(getSortIndex(0)).toBe(1500 + SORT_INDEX_GAP);
      expect(getSortIndex(1)).toBe(1500 + SORT_INDEX_GAP * 2);
    });

    it('should divide the remaining space when a full gap does not fit above the highest sortIndex', () => {
      expect.assertions(2);

      const highest = SORT_INDEX_MAX - SORT_INDEX_GAP;
      const getSortIndex = createAppendedSortIndex([highest], 2);

      expect(getSortIndex(0)).toBe(highest + SORT_INDEX_GAP / 2);
      expect(getSortIndex(1)).toBe(SORT_INDEX_MAX);
    });

    it('should keep every appended sortIndex within the safe integer range', () => {
      expect.assertions(1);

      const getSortIndex = createAppendedSortIndex([SORT_INDEX_MAX - 1], MAX_DOKUMENTER);
      const sortIndexes = Array.from({ length: MAX_DOKUMENTER }, (_, index) => getSortIndex(index));

      expect(sortIndexes.every((sortIndex) => sortIndex <= SORT_INDEX_MAX)).toBe(true);
    });
  });

  describe('getSortIndexBetween', () => {
    it('should return 0 when there are no neighbors', () => {
      expect.assertions(1);

      expect(getSortIndexBetween(undefined, undefined)).toBe(0);
    });

    it('should return a full gap below the given value when making a document first', () => {
      expect.assertions(1);

      expect(getSortIndexBetween(undefined, 1000)).toBe(1000 - SORT_INDEX_GAP);
    });

    it('should return a full gap above the given value when making a document last', () => {
      expect.assertions(1);

      expect(getSortIndexBetween(1000, undefined)).toBe(1000 + SORT_INDEX_GAP);
    });

    it('should return the midpoint between two neighbors', () => {
      expect.assertions(1);

      expect(getSortIndexBetween(1000, 2000)).toBe(1500);
    });

    it('should return the midpoint of neighbors in opposite ends of the space', () => {
      expect.assertions(1);

      expect(getSortIndexBetween(SORT_INDEX_MIN, SORT_INDEX_MAX)).toBe(0);
    });

    it('should divide the remaining space when a full gap does not fit below the first document', () => {
      expect.assertions(1);

      const first = SORT_INDEX_MIN + SORT_INDEX_GAP / 2;

      expect(getSortIndexBetween(undefined, first)).toBe(SORT_INDEX_MIN + SORT_INDEX_GAP / 4);
    });

    it('should divide the remaining space when a full gap does not fit above the last document', () => {
      expect.assertions(1);

      const last = SORT_INDEX_MAX - SORT_INDEX_GAP / 2;

      expect(getSortIndexBetween(last, undefined)).toBe(SORT_INDEX_MAX - SORT_INDEX_GAP / 4);
    });

    it('should stay within the safe integer range at the very edges of the space', () => {
      expect.assertions(2);

      expect(getSortIndexBetween(undefined, SORT_INDEX_MIN)).toBe(SORT_INDEX_MIN);
      expect(getSortIndexBetween(SORT_INDEX_MAX, undefined)).toBe(SORT_INDEX_MAX);
    });
  });
});
