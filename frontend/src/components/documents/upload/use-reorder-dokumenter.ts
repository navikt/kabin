import { compareDokumenter } from '@app/domain/document';
import { getSortIndexBetween } from '@app/domain/sort-index';
import { useSetDokumentSortIndexMutation } from '@app/redux/api/registreringer/documents';
import type { RegistreringDokument } from '@app/redux/api/registreringer/types';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

// How long the FLIP reorder animation runs for.
const REORDER_ANIMATION_DURATION_MS = 200;

/** Handed to every row, letting it feed native drag events back into the reorder state.
 * Stable across renders, so rows keep their `React.memo` bailout. */
export interface DokumentDragHandlers {
  /** A drag of this document started. */
  onDragStart: (dokumentId: string) => void;
  /** The document currently being dragged entered this document's row - moves the preview. */
  onDragEnter: (dokumentId: string) => void;
  /** The drag ended, whether it was dropped or cancelled. */
  onDragEnd: () => void;
}

/**
 * Owns the order the documents are rendered in, and everything that changes it:
 *
 * - Sorting by `sortIndex` ascending - the document with the lowest one is the hoveddokument.
 * - Moving a document (drag and drop, or the move buttons), which is persisted purely as a new
 *   `sortIndex` for the moved document - see `getSortIndexBetween`.
 * - A live preview of the new order while dragging, animated with FLIP.
 */
export const useReorderDokumenter = (registreringId: string, dokumenter: RegistreringDokument[]) => {
  const [setDokumentSortIndex, { isLoading: isMoving, originalArgs }] = useSetDokumentSortIndexMutation();

  // Sorted purely by `sortIndex` ascending - the document with the lowest one is the hoveddokument.
  const sortedDokumenter = useMemo(() => dokumenter.toSorted(compareDokumenter), [dokumenter]);

  // The rendered order, as ids only (not the document objects), so content-only updates (e.g.
  // upload progress) render immediately without waiting on the effect below. While a drag is in
  // progress this holds the previewed order, which the store doesn't know about yet.
  const [order, setOrder] = useState(() => sortedDokumenter.map((dokument) => dokument.id));
  const [draggedDokumentId, setDraggedDokumentId] = useState<string | null>(null);
  // Lags `draggedDokumentId` by a frame - see `onDragStart`.
  const [dragSlotDokumentId, setDragSlotDokumentId] = useState<string | null>(null);
  // The order a drop just put the documents in, held until the store reflects it - see the sync
  // effect below.
  const [droppedOrder, setDroppedOrder] = useState<string[] | null>(null);

  const rowElementsRef = useRef(new Map<string, HTMLLIElement>());
  const rowRefCallbacksRef = useRef(new Map<string, (node: HTMLLIElement | null) => void>());
  const previousRectsRef = useRef(new Map<string, DOMRect>());

  // Kept up to date every render, without being dependencies of the callbacks below, so those stay
  // referentially stable across renders while still reading fresh values whenever they're actually
  // invoked - from event handlers, long after the render that created them.
  const draggedDokumentIdRef = useRef<string | null>(null);
  const lastEnteredDokumentIdRef = useRef<string | null>(null);
  const dragStartFrameRef = useRef<number | null>(null);
  const sortedDokumenterRef = useRef(sortedDokumenter);
  sortedDokumenterRef.current = sortedDokumenter;

  const getRowRef = useCallback((dokumentId: string) => {
    const existing = rowRefCallbacksRef.current.get(dokumentId);

    if (existing !== undefined) {
      return existing;
    }

    const callback = (node: HTMLLIElement | null) => {
      if (node === null) {
        rowElementsRef.current.delete(dokumentId);
      } else {
        rowElementsRef.current.set(dokumentId, node);
      }
    };

    rowRefCallbacksRef.current.set(dokumentId, callback);

    return callback;
  }, []);

  // "First" of the FLIP animation (First-Last-Invert-Play) - capture each row's position before
  // the DOM reflects the new order. "Last, Invert, Play" happens in the layout effect below.
  const captureRects = useCallback(() => {
    previousRectsRef.current.clear();

    for (const [dokumentId, element] of rowElementsRef.current) {
      previousRectsRef.current.set(dokumentId, element.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    // While dragging, the preview order is the source of truth. The store is synced back in once
    // the drag ends - either because the drop was persisted, or by snapping back to the
    // pre-drag order (animated, like any other reorder) if it wasn't.
    if (draggedDokumentId !== null) {
      return;
    }

    const nextOrder = sortedDokumenter.map((dokument) => dokument.id);

    if (nextOrder.length !== order.length || nextOrder.some((id) => !order.includes(id))) {
      // Added or removed - nothing to animate, apply immediately.
      setOrder(nextOrder);

      return;
    }

    if (droppedOrder !== null) {
      // The rows are already exactly where the user dropped them. Until the store reflects that -
      // the optimistic `sortIndex` update can land a render later than the drop itself - it must
      // not be allowed to move them back through their pre-drop positions, which would play the
      // reorder animation for a move the user just made by hand.
      if (!isSameOrder(order, droppedOrder)) {
        // A preview update that hadn't rendered yet when the drop was handled. What was persisted
        // is what the rows must show - corrected instantly, since it's a position the user never
        // saw them in.
        setOrder(droppedOrder);
      }

      if (isSameOrder(nextOrder, droppedOrder)) {
        setDroppedOrder(null);
      }

      return;
    }

    if (isSameOrder(nextOrder, order)) {
      return;
    }

    captureRects();
    setOrder(nextOrder);
  }, [sortedDokumenter, order, draggedDokumentId, droppedOrder, captureRects]);

  // "Last, Invert, Play" - measure the new positions and animate from the captured position.
  // Uses `element.animate()` so the animation runs on the compositor. Loops over `order` (not the
  // ref map) so it stays a real dependency and biome's fixer won't strip it from the array below.
  useLayoutEffect(() => {
    if (previousRectsRef.current.size === 0) {
      return;
    }

    for (const dokumentId of order) {
      const element = rowElementsRef.current.get(dokumentId);
      const previousRect = previousRectsRef.current.get(dokumentId);

      if (element === undefined || previousRect === undefined) {
        continue;
      }

      const deltaY = previousRect.top - element.getBoundingClientRect().top;

      if (deltaY === 0) {
        continue;
      }

      element.animate([{ transform: `translateY(${deltaY}px)` }, { transform: 'none' }], {
        duration: REORDER_ANIMATION_DURATION_MS,
        easing: 'ease',
      });
    }

    previousRectsRef.current.clear();
  }, [order]);

  const dokumentById = useMemo(
    () => new Map(sortedDokumenter.map((dokument) => [dokument.id, dokument])),
    [sortedDokumenter],
  );

  // Falls back to `sortedDokumenter`'s order for ids not yet in `order` (e.g. a document added
  // this render, before the effect above has run).
  const displayedDokumenter = order
    .map((id) => dokumentById.get(id))
    .concat(sortedDokumenter.filter((dokument) => !order.includes(dokument.id)))
    .filter((dokument): dokument is RegistreringDokument => dokument !== undefined);

  const displayedDokumenterRef = useRef(displayedDokumenter);
  displayedDokumenterRef.current = displayedDokumenter;

  /** Persists `dokumentId` at `toIndex` of the resulting order. Only the moved document gets a new
   * `sortIndex` - the midpoint of the two documents it ends up between - so every move is a single
   * request, no matter how far it moves or how many documents there are. Returns the pending
   * mutation, or `undefined` if `toIndex` was out of bounds and nothing was moved. */
  const moveDokument = useCallback(
    (dokumentId: string, toIndex: number) => {
      // The neighbors are taken from the list *without* the moved document, which is exactly what
      // `toIndex` indexes into: inserting it there reproduces the intended order.
      const others = displayedDokumenterRef.current.filter((d) => d.id !== dokumentId);

      if (toIndex < 0 || toIndex > others.length) {
        return undefined;
      }

      const sortIndex = getSortIndexBetween(others[toIndex - 1]?.sortIndex, others[toIndex]?.sortIndex);

      return setDokumentSortIndex({ id: registreringId, dokumentId, sortIndex });
    },
    [registreringId, setDokumentSortIndex],
  );

  const moveDokumentBy = useCallback(
    (dokumentId: string, offset: number) => {
      const index = displayedDokumenterRef.current.findIndex((d) => d.id === dokumentId);

      if (index === -1) {
        return;
      }

      moveDokument(dokumentId, index + offset);
    },
    [moveDokument],
  );

  /** Making a document the hoveddokument is just moving it to the front. */
  const moveToTop = useCallback((dokumentId: string) => moveDokument(dokumentId, 0), [moveDokument]);

  const moveUp = useCallback((dokumentId: string) => moveDokumentBy(dokumentId, -1), [moveDokumentBy]);

  const moveDown = useCallback((dokumentId: string) => moveDokumentBy(dokumentId, 1), [moveDokumentBy]);

  /** Drops a not-yet-applied drop slot render, for drags that end within the same frame they
   * started in. */
  const cancelDragStartFrame = useCallback(() => {
    if (dragStartFrameRef.current !== null) {
      cancelAnimationFrame(dragStartFrameRef.current);
      dragStartFrameRef.current = null;
    }
  }, []);

  const onDragStart = useCallback((dokumentId: string) => {
    draggedDokumentIdRef.current = dokumentId;
    lastEnteredDokumentIdRef.current = dokumentId;
    setDraggedDokumentId(dokumentId);

    // The browser snapshots the row for the drag image that follows the pointer, and does so after
    // `dragstart` has been handled - by which point React has already rendered the row as an empty
    // drop slot, making the drag image an empty slot too. Only the slot itself is deferred by a
    // frame, so the snapshot is taken of the row as it looks while still in place; everything else
    // about the drag takes effect immediately.
    dragStartFrameRef.current = requestAnimationFrame(() => {
      dragStartFrameRef.current = null;
      setDragSlotDokumentId(dokumentId);
    });
  }, []);

  const onDragEnter = useCallback(
    (targetDokumentId: string) => {
      const dokumentId = draggedDokumentIdRef.current;

      // Also fires for file drags, which reorder nothing.
      if (dokumentId === null) {
        return;
      }

      // `dragenter` fires again for every nested element the pointer moves into within a row.
      // Collapsing repeats of the same row keeps the preview from flip-flopping: right after a
      // swap, the row the pointer is over is the dragged one, so the next *different* row it
      // reports really is a new position.
      if (lastEnteredDokumentIdRef.current === targetDokumentId) {
        return;
      }

      lastEnteredDokumentIdRef.current = targetDokumentId;

      if (dokumentId === targetDokumentId) {
        return;
      }

      const currentOrder = displayedDokumenterRef.current.map((d) => d.id);
      const fromIndex = currentOrder.indexOf(dokumentId);
      const toIndex = currentOrder.indexOf(targetDokumentId);

      if (fromIndex === -1 || toIndex === -1) {
        return;
      }

      captureRects();
      setOrder(currentOrder.toSpliced(fromIndex, 1).toSpliced(toIndex, 0, dokumentId));
    },
    [captureRects],
  );

  const onDragEnd = useCallback(() => {
    draggedDokumentIdRef.current = null;
    lastEnteredDokumentIdRef.current = null;
    cancelDragStartFrame();
    setDraggedDokumentId(null);
    setDragSlotDokumentId(null);
  }, [cancelDragStartFrame]);

  /** Persists the previewed order, and holds the rows there until the store agrees, so a drop is
   * never replayed as an animated move. */
  const onDrop = useCallback(() => {
    const dokumentId = draggedDokumentIdRef.current;

    if (dokumentId === null) {
      return;
    }

    const previewOrder = displayedDokumenterRef.current.map((d) => d.id);
    const toIndex = previewOrder.indexOf(dokumentId);
    // Only the dragged document moves within the preview, so an unchanged index means the whole
    // order is unchanged - it was dropped right back where it started.
    const fromIndex = sortedDokumenterRef.current.findIndex((d) => d.id === dokumentId);
    const move = toIndex === fromIndex ? undefined : moveDokument(dokumentId, toIndex);

    if (move !== undefined) {
      setDroppedOrder(previewOrder);

      // Released once the move settles: on success the store caught up long before that (lifting
      // the hold on its own), while a rejected move has been rolled back, and the rows should
      // animate back to where they came from.
      move.finally(() => setDroppedOrder((current) => (current === previewOrder ? null : current)));
    }

    draggedDokumentIdRef.current = null;
    lastEnteredDokumentIdRef.current = null;
    cancelDragStartFrame();
    setDraggedDokumentId(null);
    setDragSlotDokumentId(null);
  }, [moveDokument, cancelDragStartFrame]);

  const dragHandlers = useMemo<DokumentDragHandlers>(
    () => ({ onDragStart, onDragEnter, onDragEnd }),
    [onDragStart, onDragEnter, onDragEnd],
  );

  return {
    displayedDokumenter,
    getRowRef,
    /** The document being dragged right now, if any. */
    draggedDokumentId,
    /** The document whose row is rendered as an empty drop slot - the dragged one, a frame later. */
    dragSlotDokumentId,
    /** The document whose move is currently in flight, if any. */
    movingDokumentId: isMoving ? (originalArgs?.dokumentId ?? null) : null,
    moveToTop,
    moveUp,
    moveDown,
    dragHandlers,
    onDrop,
  };
};

const isSameOrder = (a: string[], b: string[]): boolean =>
  a.length === b.length && a.every((id, index) => id === b[index]);
