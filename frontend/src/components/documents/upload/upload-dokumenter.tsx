import { Alert } from '@app/components/alert/alert';
import { CardMedium } from '@app/components/card/card';
import { DokumentDropzone } from '@app/components/documents/upload/dokument-dropzone';
import { DokumentRow } from '@app/components/documents/upload/dokument-row/dokument-row';
import { InngaaendeKanalSlot } from '@app/components/documents/upload/inngaaende-kanal-slot';
import {
  type DokumentDragHandlers,
  useReorderDokumenter,
} from '@app/components/documents/upload/use-reorder-dokumenter';
import { type UploadProgressEntry, useUploadFiles } from '@app/components/documents/upload/use-upload-files';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { getDocumentCountText } from '@app/domain/document-count';
import { formatFileSize, MAX_TOTAL_SIZE_BYTES } from '@app/domain/file-size';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useDokumentConfirmSse } from '@app/hooks/use-dokument-confirm-sse';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import type { RegistreringDokument } from '@app/redux/api/registreringer/types';
import { DOKUMENT_TERMINAL_STATUSES, DokumentStatus } from '@app/redux/api/registreringer/types';
import { ValidationFieldNames } from '@app/types/validation';
import { BodyShort, HStack, ProgressBar, type ProgressBarProps, VStack } from '@navikt/ds-react';
import { type DragEvent, memo, type Ref } from 'react';

const NON_RESUMABLE_STATUSES: DokumentStatus[] = [DokumentStatus.UPLOADING];

const TOTAL_SIZE_WARNING_RATIO = 0.8;

export const UploadDokumenter = () => {
  const { id, uploadedDocuments } = useRegistrering();
  const canEdit = useCanEdit();
  const { uploadFiles, progress, abortUpload, isPending } = useUploadFiles(id);
  const dokumenterError = useValidationError(ValidationFieldNames.DOKUMENTER);
  const inngaaendeKanalError = useValidationError(ValidationFieldNames.INNGAAENDE_KANAL);

  const { dokumenter, inngaaendeKanal } = uploadedDocuments;

  const {
    displayedDokumenter,
    getRowRef,
    draggedDokumentId,
    dragSlotDokumentId,
    movingDokumentId,
    moveToTop,
    moveUp,
    moveDown,
    dragHandlers,
    onDrop,
  } = useReorderDokumenter(id, dokumenter);

  const totalSize = dokumenter.filter((d) => d.status === DokumentStatus.DONE).reduce((sum, d) => sum + d.size, 0);

  // The hoveddokument is at index 0, so the last index is the highest attachment number.
  const attachmentNumberWidth = getNumberWidth(displayedDokumenter.length - 1);

  // Dropping is handled here rather than per row, so letting go anywhere in the list - including
  // the empty space below the last row - commits the previewed order instead of snapping back.
  const onListDragOver = (event: DragEvent) => {
    if (draggedDokumentId === null) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  return (
    <>
      <CardMedium labelledBy="upload-documents-heading" id="upload-documents">
        <BodyShort size="small" id="upload-documents-heading" className="sr-only">
          Last opp dokumenter
        </BodyShort>

        <ValidationErrorMessage error={dokumenterError} id={ValidationFieldNames.DOKUMENTER} />
        <ValidationErrorMessage error={inngaaendeKanalError} id={ValidationFieldNames.INNGAAENDE_KANAL} />

        <DokumentDropzone
          onSelect={uploadFiles}
          disabled={!canEdit}
          className="flex h-full min-h-0 grow flex-col overflow-hidden"
          inngaaendeKanalSlot={<InngaaendeKanalSlot registreringId={id} inngaaendeKanal={inngaaendeKanal} />}
        >
          <VStack gap="space-2" flexShrink="0" paddingBlock="space-8 space-0">
            <ProgressBar
              size="small"
              value={totalSize}
              valueMax={MAX_TOTAL_SIZE_BYTES}
              data-color={getTotalSizeColor(totalSize)}
              aria-label={`Total filstørrelse: ${formatFileSize(totalSize)} av maks ${formatFileSize(MAX_TOTAL_SIZE_BYTES)}`}
            />
            <HStack justify="space-between">
              <BodyShort size="small" className="text-ax-text-neutral-subtle">
                {formatFileSize(totalSize)} av maks {formatFileSize(MAX_TOTAL_SIZE_BYTES)}
              </BodyShort>

              <BodyShort size="small" className="text-ax-text-neutral-subtle">
                {getDocumentCountText(dokumenter.length)}
              </BodyShort>
            </HStack>
          </VStack>

          {dokumenter.length === 0 ? (
            <VStack
              align="center"
              justify="center"
              flexGrow="1"
              paddingBlock="space-8 space-0"
              className="pointer-events-none"
            >
              <BodyShort size="large" className="text-ax-text-neutral-subtle" align="center">
                Dra og slipp dokumenter her, eller trykk på «Last opp»
              </BodyShort>
            </VStack>
          ) : (
            <VStack
              as="ul"
              overflowY="auto"
              flexGrow="1"
              paddingBlock="space-8 space-0"
              className="list-none"
              onDragOver={onListDragOver}
              onDrop={onDrop}
            >
              {displayedDokumenter.map((dokument, index) => (
                <DokumentRowWithSse
                  key={dokument.id}
                  ref={getRowRef(dokument.id)}
                  registreringId={id}
                  dokument={dokument}
                  isHoveddokument={index === 0}
                  attachmentNumber={index}
                  attachmentNumberWidth={attachmentNumberWidth}
                  onSetHoveddokument={moveToTop}
                  isSettingHoveddokument={movingDokumentId === dokument.id}
                  onMoveUp={moveUp}
                  onMoveDown={moveDown}
                  canMoveUp={index > 0}
                  canMoveDown={index < displayedDokumenter.length - 1}
                  dragHandlers={dragHandlers}
                  isDragged={dragSlotDokumentId === dokument.id}
                  uploadProgress={progress[dokument.id]}
                  abortUpload={abortUpload}
                  isLastAttachment={index === displayedDokumenter.length - 1}
                  isOdd={index % 2 === 1}
                  canEdit={canEdit && !isPending(dokument.id)}
                />
              ))}
            </VStack>
          )}
        </DokumentDropzone>
      </CardMedium>

      <Alert variant="info">Opplastede dokumenter blir journalført ved fullføring.</Alert>
    </>
  );
};

interface DokumentRowWithSseProps {
  registreringId: string;
  dokument: RegistreringDokument;
  isHoveddokument: boolean;
  attachmentNumber: number;
  attachmentNumberWidth: string;
  onSetHoveddokument: (dokumentId: string) => void;
  isSettingHoveddokument: boolean;
  onMoveUp: (dokumentId: string) => void;
  onMoveDown: (dokumentId: string) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  dragHandlers: DokumentDragHandlers;
  isDragged: boolean;
  uploadProgress?: UploadProgressEntry;
  abortUpload: (dokumentId: string) => void;
  isLastAttachment: boolean;
  isOdd: boolean;
  canEdit: boolean;
  ref?: Ref<HTMLLIElement>;
}

const DokumentRowWithSse = memo(({ registreringId, dokument, ...props }: DokumentRowWithSseProps) => {
  const shouldConnect =
    !NON_RESUMABLE_STATUSES.includes(dokument.status) && !DOKUMENT_TERMINAL_STATUSES.includes(dokument.status);

  useDokumentConfirmSse(registreringId, dokument.id, shouldConnect);

  return <DokumentRow registreringId={registreringId} dokument={dokument} {...props} />;
});

/** Width in `ch` units, wide enough for `maxNumber` when rendered with tabular numerals. */
const getNumberWidth = (maxNumber: number): string => `${maxNumber.toString(10).length}ch`;

const getTotalSizeColor = (totalSize: number): ProgressBarProps['data-color'] => {
  const ratio = totalSize / MAX_TOTAL_SIZE_BYTES;

  if (ratio >= 1) {
    return 'danger';
  }

  if (ratio >= TOTAL_SIZE_WARNING_RATIO) {
    return 'warning';
  }

  return undefined;
};
