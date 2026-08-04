/**
 * Gap-based (fractional) ranking for `RegistreringDokument.sortIndex`. Documents are sorted by
 * `sortIndex` ascending, and the document with the lowest `sortIndex` is the hoveddokument.
 *
 * We can safely assume no more than `MAX_DOKUMENTER` documents will ever be uploaded to a single
 * registrering, so a fixed, generous `SORT_INDEX_GAP` between documents - sized by dividing a
 * float64's safe integer range across that many documents:
 *
 * - For appending further documents after the last one, one at a time or in batches (the batch
 *   size is always known upfront, so a whole batch is spaced out in a single pass, each document
 *   getting its own full-sized gap, rather than being crammed into a smaller reserved region).
 * - For reordering documents (each move only needs to bisect a single, local gap between two
 *   neighbors), even after many repeated moves, before a gap ever gets too small.
 *
 * The very first document gets `sortIndex` 0, and the rest of the initial batch is spaced out
 * above it. The negative space, all the way down to `SORT_INDEX_MIN`, is thereby left free for
 * reordering, i.e. repeatedly moving documents to the front ("make this the hoveddokument" is just
 * a special case of that), and the positive space, up to `SORT_INDEX_MAX`, for appending and
 * moving documents to the back.
 *
 * Only when a document is moved past an edge document with less than a full gap of space left
 * beyond it is that remaining space bisected, exactly like the space between two documents is.
 *
 * The API follows the same logic when it assigns initial values to newly uploaded documents,
 * client-side optimistic updates match the server values.
 *
 * If a gap ever does get too small to bisect, the logic breaks.
 * This requires more than 1000 repeated moves, and is therefore considered a theoretical problem only.
 */
export const MAX_DOKUMENTER = 10_000;

export const SORT_INDEX_MAX = Number.MAX_SAFE_INTEGER;

export const SORT_INDEX_MIN = Number.MIN_SAFE_INTEGER;

export const SORT_INDEX_GAP = SORT_INDEX_MAX / MAX_DOKUMENTER;

/** Returns a function that maps a document's 0-based position within a batch of new documents to
 * the `sortIndex` it should get. The batch is placed after every document already present, in the
 * order given: the very first document of the very first batch gets `0`, and every document after
 * it one full `SORT_INDEX_GAP` above its predecessor. Mirrors the values the API assigns to newly
 * uploaded documents. */
export const createAppendedSortIndex = (existingSortIndexes: number[], count: number): ((index: number) => number) => {
  const isFirstBatch = existingSortIndexes.length === 0;
  const highest = isFirstBatch ? 0 : Math.max(...existingSortIndexes);
  // The first batch starts at `0` itself, later batches a full gap above the highest `sortIndex`.
  const gap = getFittingGap(highest, isFirstBatch ? count - 1 : count);
  const start = isFirstBatch ? 0 : highest + gap;

  return (index) => start + index * gap;
};

/** Returns the `sortIndex` a document should be given to sit between `before` and `after` in
 * ascending sort order - the midpoint of the two. Omitting `before` means "make this first",
 * omitting `after` means "make this last", which places the document a full `SORT_INDEX_GAP`
 * beyond its only neighbor - unless there is less than a full gap of space left out there, in
 * which case what remains is bisected instead. Omitting both means "the only document", which
 * gets `0`, just like the very first document of a registrering. */
export const getSortIndexBetween = (before: number | undefined, after: number | undefined): number => {
  if (before !== undefined && after !== undefined) {
    return getMidpoint(before, after);
  }

  if (after !== undefined) {
    return after - SORT_INDEX_GAP >= SORT_INDEX_MIN ? after - SORT_INDEX_GAP : getMidpoint(SORT_INDEX_MIN, after);
  }

  if (before !== undefined) {
    return before + SORT_INDEX_GAP <= SORT_INDEX_MAX ? before + SORT_INDEX_GAP : getMidpoint(before, SORT_INDEX_MAX);
  }

  return 0;
};

/** The midpoint of `before` and `after`, as an offset from `before`. */
const getMidpoint = (before: number, after: number): number => before + (after - before) / 2;

/** A full `SORT_INDEX_GAP`, unless `gapCount` of those wouldn't fit between `from` and
 * `SORT_INDEX_MAX` - then the remaining space is divided evenly instead. Theoretical safeguard
 * only: exhausting the space requires far more documents than `MAX_DOKUMENTER`. */
const getFittingGap = (from: number, gapCount: number): number =>
  gapCount <= 0 ? SORT_INDEX_GAP : Math.min(SORT_INDEX_GAP, (SORT_INDEX_MAX - from) / gapCount);
