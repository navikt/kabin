import { ACCEPTED_FILE_TYPES } from '@app/components/documents/upload/use-upload-files';
import { CloudUpIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading, HStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';

interface Props {
  onSelect: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  inngaaendeKanalSlot?: React.ReactNode;
}

/** A custom dropzone: the whole area (including the header row) accepts drag-and-drop,
 * unlike Aksel's `FileUpload.Dropzone`, which reserves a large, mostly empty area just for dropping files. */
export const DokumentDropzone = ({
  onSelect,
  disabled = false,
  className = '',
  children,
  inngaaendeKanalSlot,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const onDragEnter = (e: React.DragEvent) => {
    if (isFileDrag(e)) {
      setIsDraggingOver(true);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    if (isFileDrag(e)) {
      e.preventDefault();
    }
  };

  const onDragLeave = () => setIsDraggingOver(false);

  const onDrop = (e: React.DragEvent) => {
    if (!isFileDrag(e)) {
      return;
    }

    e.preventDefault();
    setIsDraggingOver(false);
    onSelect(Array.from(e.dataTransfer.files));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      onSelect(Array.from(e.target.files));
    }

    // Allows selecting the same file again in a row.
    e.target.value = '';
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Drag-and-drop only; file selection is handled by the button and native file input below.
    <div
      className={`rounded border-2 border-dashed p-2 transition-colors ${
        isDraggingOver ? 'border-ax-border-accent-strong bg-ax-bg-accent-moderate' : 'border-ax-border-neutral-subtle'
      } ${className}`}
      onDragEnter={disabled ? undefined : onDragEnter}
      onDragOver={disabled ? undefined : onDragOver}
      onDragLeave={disabled ? undefined : onDragLeave}
      onDrop={disabled ? undefined : onDrop}
    >
      <HStack align="center" gap="space-8" wrap={false} flexShrink="0">
        <CloudUpIcon aria-hidden fontSize="1.5rem" className="text-ax-icon-neutral-subtle" />

        <Heading size="small" level="1" className="whitespace-nowrap">
          Opplastede dokumenter
        </Heading>

        <BodyShort size="small" className="grow text-ax-text-neutral-subtle">
          PDF, JPG, PNG eller TIFF
        </BodyShort>

        {inngaaendeKanalSlot}

        <Button
          size="small"
          variant="secondary"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          icon={<CloudUpIcon aria-hidden />}
        >
          Last opp
        </Button>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_FILE_TYPES}
          onChange={onChange}
          disabled={disabled}
          className="hidden"
          aria-label="Last opp dokumenter"
        />
      </HStack>
      {children}
    </div>
  );
};

/** Whether the drag carries files, as opposed to e.g. a document row being dragged to a new
 * position within the list this dropzone wraps - which must not be treated as a file drop. */
const isFileDrag = (e: React.DragEvent): boolean => e.dataTransfer.types.includes('Files');
