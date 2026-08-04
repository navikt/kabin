import { DeleteDokumentButton } from '@app/components/documents/upload/dokument-row/delete-dokument-button';
import { DokumentRowProgress } from '@app/components/documents/upload/dokument-row/dokument-row-progress';
import { DokumentSizeIndicator } from '@app/components/documents/upload/dokument-row/dokument-size-indicator';
import { DokumentStatusIndicator } from '@app/components/documents/upload/dokument-row/dokument-status-indicator';
import { MoveDokumentButtons } from '@app/components/documents/upload/dokument-row/move-dokument-buttons';
import { RetryDokumentButton } from '@app/components/documents/upload/dokument-row/retry-dokument-button';
import { SetHoveddokumentButton } from '@app/components/documents/upload/dokument-row/set-hoveddokument-button';
import { UploadedDokumentRename } from '@app/components/documents/upload/dokument-row/uploaded-dokument-rename';
import type { DokumentDragHandlers } from '@app/components/documents/upload/use-reorder-dokumenter';
import type { UploadProgressEntry } from '@app/components/documents/upload/use-upload-files';
import { DocumentViewerContext, isViewedUploadedDokument } from '@app/pages/registrering/document-viewer-context';
import {
  DOKUMENT_RETRYABLE_STATUSES,
  DokumentStatus,
  type RegistreringDokument,
} from '@app/redux/api/registreringer/types';
import { DragVerticalIcon, PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Tooltip } from '@navikt/ds-react';
import { type DragEvent, memo, type Ref, useContext, useState } from 'react';

interface Props {
  registreringId: string;
  dokument: RegistreringDokument;
  isHoveddokument: boolean;
  /** Position among the attachments, starting at 1. Ignored when `isHoveddokument` is true. */
  attachmentNumber: number;
  /** CSS width shared by all rows, so the numbers and file names line up. See `getNumberWidth`. */
  attachmentNumberWidth: string;
  onSetHoveddokument: (dokumentId: string) => void;
  isSettingHoveddokument: boolean;
  onMoveUp: (dokumentId: string) => void;
  onMoveDown: (dokumentId: string) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  dragHandlers: DokumentDragHandlers;
  /** Whether this row is the one currently being dragged - rendered as an empty drop slot. */
  isDragged: boolean;
  uploadProgress?: UploadProgressEntry;
  abortUpload: (dokumentId: string) => void;
  isLastAttachment: boolean;
  isOdd: boolean;
  /**
   * Whether editing is allowed at all AND `dokument.id` is a real, server-known ID rather than a
   * temporary, locally generated one still awaiting `replaceDokumentId` (see `useUploadFiles`).
   * Server-backed actions (rename/delete/set-as-hoveddokument) must stay disabled for temp IDs —
   * the server doesn't know them, and racing the swap could leave the store in an inconsistent
   * state.
   */
  canEdit: boolean;
  /**
   * `ref` is used by the parent to measure/animate this row's position on reorder.
   * See the FLIP animation in `upload-dokumenter.tsx`.
   */
  ref?: Ref<HTMLLIElement>;
}

export const DokumentRow = memo(
  ({
    registreringId,
    dokument,
    isHoveddokument,
    attachmentNumber,
    attachmentNumberWidth,
    onSetHoveddokument,
    isSettingHoveddokument,
    onMoveUp,
    onMoveDown,
    canMoveUp,
    canMoveDown,
    dragHandlers,
    isDragged,
    uploadProgress,
    abortUpload,
    isLastAttachment,
    isOdd,
    canEdit,
    ref,
  }: Props) => {
    const [isRenaming, setIsRenaming] = useState(false);
    // Only set while the drag handle is held down, so the rest of the row - which can contain a
    // text input - keeps its normal click, focus and text selection behavior.
    const [isDraggable, setIsDraggable] = useState(false);
    const { dokument: viewedDokument, viewDokument } = useContext(DocumentViewerContext);

    const isViewed =
      viewedDokument !== null && isViewedUploadedDokument(viewedDokument) && viewedDokument.dokumentId === dokument.id;

    const isViewable = dokument.status === DokumentStatus.DONE;

    const toggleView = () => {
      if (isViewed) {
        viewDokument(null);

        return;
      }

      viewDokument({
        kind: 'uploaded',
        registreringId,
        dokumentId: dokument.id,
        name: dokument.name,
        contentType: dokument.contentType,
      });
    };

    const onDragStart = (event: DragEvent<HTMLLIElement>) => {
      // The row is only draggable while the drag handle is held down. Anything else that can start
      // a drag inside it (e.g. dragging selected text) bubbles up here and must be left alone.
      if (!isDraggable) {
        return;
      }

      // Firefox refuses to start a drag unless some data is set.
      event.dataTransfer.setData('text/plain', dokument.id);
      event.dataTransfer.effectAllowed = 'move';
      dragHandlers.onDragStart(dokument.id);
    };

    const onDragEnd = () => {
      setIsDraggable(false);
      dragHandlers.onDragEnd();
    };

    return (
      <li
        ref={ref}
        draggable={isDraggable}
        onDragStart={onDragStart}
        onDragEnter={() => dragHandlers.onDragEnter(dokument.id)}
        onDragEnd={onDragEnd}
        className={`relative shrink-0 ${isHoveddokument ? '' : 'pl-8'}`}
      >
        {isHoveddokument ? null : <TreeConnector isLast={isLastAttachment} />}

        <div
          className={`relative overflow-hidden rounded ${isDragged ? 'bg-ax-bg-neutral-moderate outline-dashed outline-2 outline-ax-border-accent-strong -outline-offset-2' : isViewed ? 'bg-ax-bg-warning-moderate' : isOdd ? 'bg-ax-bg-default' : 'bg-ax-bg-neutral-moderate'}`}
        >
          {isDragged ? null : <DokumentRowProgress dokument={dokument} uploadProgress={uploadProgress} />}

          {/* While dragging, the row is left as an empty slot marking where the document will land -
          the drag image following the pointer is the only visible copy of it. Hidden rather than
          unmounted, so the slot keeps the exact height of the document it holds. */}
          <div
            className={`relative z-10 grid items-center gap-x-2 p-1 ${isDragged ? 'invisible' : ''}`}
            style={{ gridTemplateColumns: isHoveddokument ? HOVEDDOKUMENT_COLUMNS : ATTACHMENT_COLUMNS }}
          >
            <div className="flex w-5">{canEdit ? <DragHandle onHold={setIsDraggable} /> : null}</div>

            <AttachmentNumber
              isHoveddokument={isHoveddokument}
              attachmentNumber={attachmentNumber}
              attachmentNumberWidth={attachmentNumberWidth}
            />

            {isRenaming ? (
              <UploadedDokumentRename
                registreringId={registreringId}
                dokument={dokument}
                exitEditMode={() => setIsRenaming(false)}
              />
            ) : (
              <HStack align="center" gap="space-4" wrap={false} className="overflow-hidden">
                <button
                  type="button"
                  onClick={toggleView}
                  disabled={!isViewable}
                  title={dokument.name}
                  className="cursor-pointer truncate text-left hover:underline focus-visible:underline disabled:cursor-default disabled:hover:no-underline"
                >
                  <BodyShort as="span" weight={isViewed ? 'semibold' : 'regular'} className="truncate">
                    {dokument.name}
                  </BodyShort>
                </button>
                {canEdit ? (
                  <Tooltip content="Endre navn" delay={500}>
                    <Button
                      size="xsmall"
                      variant="tertiary-neutral"
                      icon={<PencilIcon aria-hidden />}
                      onClick={() => setIsRenaming(true)}
                    />
                  </Tooltip>
                ) : null}
              </HStack>
            )}

            <div className="flex justify-self-end">
              <SetHoveddokumentButton
                isHoveddokument={isHoveddokument}
                isLoading={isSettingHoveddokument}
                onClick={() => onSetHoveddokument(dokument.id)}
                disabled={!canEdit}
              />
            </div>

            <div className="flex justify-self-end">
              <DokumentSizeIndicator dokument={dokument} />
            </div>

            <div className="flex justify-self-center">
              {canEdit && DOKUMENT_RETRYABLE_STATUSES.includes(dokument.status) ? (
                <RetryDokumentButton
                  registreringId={registreringId}
                  dokumentId={dokument.id}
                  status={dokument.status}
                />
              ) : (
                <DokumentStatusIndicator dokument={dokument} uploadProgress={uploadProgress} />
              )}
            </div>

            <div className="flex justify-self-end">
              {canEdit ? (
                <MoveDokumentButtons
                  onMoveUp={() => onMoveUp(dokument.id)}
                  onMoveDown={() => onMoveDown(dokument.id)}
                  canMoveUp={canMoveUp}
                  canMoveDown={canMoveDown}
                />
              ) : null}
            </div>

            {canEdit ? (
              <DeleteDokumentButton
                registreringId={registreringId}
                dokumentId={dokument.id}
                abortUpload={abortUpload}
              />
            ) : null}
          </div>
        </div>
      </li>
    );
  },
);

/** Grid columns of the row content. The attachments have an extra column for the order number,
 * which the hoveddokument must not reserve space for. */
const COMMON_COLUMND = 'minmax(0,1fr) auto 5.5rem auto auto auto';
const HOVEDDOKUMENT_COLUMNS = `auto ${COMMON_COLUMND}`;
const ATTACHMENT_COLUMNS = `auto auto ${COMMON_COLUMND}`;

interface AttachmentNumberProps {
  isHoveddokument: boolean;
  attachmentNumber: number;
  attachmentNumberWidth: string;
}

/** Purely visual - the list order already conveys the sequence to screen readers. */
const AttachmentNumber = ({ isHoveddokument, attachmentNumber, attachmentNumberWidth }: AttachmentNumberProps) =>
  isHoveddokument ? null : (
    <BodyShort
      as="span"
      size="small"
      aria-hidden
      className="inline-block text-right text-ax-text-neutral-subtle tabular-nums"
      style={{ width: attachmentNumberWidth }}
    >
      {attachmentNumber}
    </BodyShort>
  );

interface DragHandleProps {
  onHold: (isHeld: boolean) => void;
}

/** Pointer-only affordance for reordering: holding it down makes the row draggable. Deliberately
 * not focusable and without an accessible name - `MoveDokumentButtons` is the keyboard and screen
 * reader equivalent. */
const DragHandle = ({ onHold }: DragHandleProps) => (
  <Tooltip content="Dra for å endre rekkefølgen" delay={500}>
    <span
      data-drag-handle
      onPointerDown={() => onHold(true)}
      onPointerUp={() => onHold(false)}
      className="flex cursor-grab text-ax-icon-neutral-subtle active:cursor-grabbing"
    >
      <DragVerticalIcon aria-hidden fontSize="1.25rem" />
    </span>
  </Tooltip>
);

interface TreeConnectorProps {
  isLast: boolean;
}

const TreeConnector = ({ isLast }: TreeConnectorProps) => (
  <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-0 block w-8">
    <span className={`absolute left-4 w-px bg-ax-border-neutral-subtle ${isLast ? 'top-0 h-1/2' : 'inset-y-0'}`} />
    <span className="absolute top-1/2 left-4 h-px w-4 bg-ax-border-neutral-subtle" />
  </span>
);
