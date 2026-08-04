import { compareDokumenter, isHoveddokument } from '@app/domain/document';
import { getDocumentCountText } from '@app/domain/document-count';
import { formatFileSize } from '@app/domain/file-size';
import { INNGAAENDE_KANAL_COLORS, INNGAAENDE_KANAL_NAMES } from '@app/domain/inngaaende-kanal';
import { InfoItem } from '@app/pages/status/common-components';
import { StyledCard } from '@app/pages/status/layout';
import type { RegistreringDokument } from '@app/redux/api/registreringer/types';
import type { UploadedDocumentsStatus } from '@app/types/status';
import { BodyShort, HStack, Tag, VStack } from '@navikt/ds-react';

interface UploadedDocumentsProps {
  uploadedDocuments: UploadedDocumentsStatus;
}

export const UploadedDocuments = ({ uploadedDocuments }: UploadedDocumentsProps) => {
  const { dokumenter, inngaaendeKanal } = uploadedDocuments;

  const sortedDokumenter = dokumenter.toSorted(compareDokumenter);

  return (
    <StyledCard title="Opplastede dokumenter" gridArea="journalpost" titleSize="medium">
      <InfoItem label="Inngående kanal">
        <Tag
          variant="outline"
          data-color={INNGAAENDE_KANAL_COLORS[inngaaendeKanal]}
          size="small"
          className="self-start"
        >
          {INNGAAENDE_KANAL_NAMES[inngaaendeKanal]}
        </Tag>
      </InfoItem>

      <InfoItem
        label={
          <HStack justify="space-between">
            <span>Dokumenter</span>
            <span className="font-normal text-ax-medium italic">{getDocumentCountText(sortedDokumenter.length)}</span>
          </HStack>
        }
      >
        {sortedDokumenter.length === 0 ? (
          <BodyShort>Ingen dokumenter</BodyShort>
        ) : (
          <VStack as="ul" gap="space-2" className="list-none" maxHeight="16em" overflowY="auto">
            {sortedDokumenter.map((dokument, index) => (
              <StatusDokumentRow
                key={dokument.id}
                dokument={dokument}
                isHoveddokument={isHoveddokument(dokument, dokumenter)}
                isLastAttachment={index === sortedDokumenter.length - 1}
                isOdd={index % 2 === 1}
              />
            ))}
          </VStack>
        )}
      </InfoItem>
    </StyledCard>
  );
};

interface StatusDokumentRowProps {
  dokument: RegistreringDokument;
  isHoveddokument: boolean;
  isLastAttachment: boolean;
  isOdd: boolean;
}

// Mirrors the layout of `DokumentRow` (upload editor) for visual consistency: attachments are
// indented and connected to the hoveddokument above them with a decorative tree connector.
const StatusDokumentRow = ({ dokument, isHoveddokument, isLastAttachment, isOdd }: StatusDokumentRowProps) => (
  <li className={`relative shrink-0 ${isHoveddokument ? '' : 'ml-8'}`}>
    {isHoveddokument ? null : <TreeConnector isLast={isLastAttachment} />}

    <div
      className={`relative z-1 overflow-hidden rounded p-1 ${isOdd ? 'bg-ax-bg-default' : 'bg-ax-bg-neutral-moderate'}`}
    >
      <div className="grid items-center gap-x-2" style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}>
        <BodyShort className="truncate" title={dokument.name}>
          {dokument.name}
        </BodyShort>

        <Tag size="small" variant="outline" data-color="neutral" className="justify-self-end whitespace-nowrap">
          {formatFileSize(dokument.size)}
        </Tag>
      </div>
    </div>
  </li>
);

interface TreeConnectorProps {
  isLast: boolean;
}

// Decorative tree connector rendered to the left of an attachment row, linking it visually
// to the hoveddokument above it (├─ for a middle attachment, └─ for the last one).
const TreeConnector = ({ isLast }: TreeConnectorProps) => (
  <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-8 z-0 block w-8">
    <span className={`absolute left-4 w-px bg-ax-border-neutral-subtle ${isLast ? 'top-0 h-1/2' : 'inset-y-0'}`} />
    <span className="absolute top-1/2 left-4 h-px w-4 bg-ax-border-neutral-subtle" />
  </span>
);
