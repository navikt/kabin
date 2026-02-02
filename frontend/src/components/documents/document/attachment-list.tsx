import { Attachment } from '@app/components/documents/document/attachment';
import { EditableLogiskeVedlegg } from '@app/components/documents/document/logiske-vedlegg/editable/logiske-vedlegg-list';
import { ReadOnlyLogiskeVedlegg } from '@app/components/documents/document/logiske-vedlegg/read-only/logiske-vedlegg-list';
import type { IArkivertDocument } from '@app/types/dokument';
import { VStack } from '@navikt/ds-react';

interface Props {
  dokument: IArkivertDocument;
  isOpen: boolean;
  temaId: string | null;
}

export const AttachmentList = ({ dokument, isOpen, temaId }: Props) => {
  if (!isOpen) {
    return null;
  }

  const { dokumentInfoId, logiskeVedlegg, vedlegg, journalpostId, harTilgangTilArkivvariant } = dokument;

  return (
    <>
      {harTilgangTilArkivvariant ? (
        <EditableLogiskeVedlegg logiskeVedlegg={logiskeVedlegg} dokumentInfoId={dokumentInfoId} temaId={temaId} inset />
      ) : (
        <ReadOnlyLogiskeVedlegg logiskeVedlegg={logiskeVedlegg} inset />
      )}
      {vedlegg.length === 0 ? null : (
        <VStack
          as="ul"
          gap="space-0"
          position="relative"
          margin="space-0"
          marginInline="space-16 space-0"
          padding="space-0"
          className="list-none"
          data-testid="documents-vedlegg-list"
          aria-label="Vedlegg"
        >
          {vedlegg.map((v, index) => (
            <Attachment
              key={`vedlegg_${journalpostId}_${v.dokumentInfoId}`}
              vedlegg={v}
              dokument={dokument}
              isLast={index === vedlegg.length - 1}
            />
          ))}
        </VStack>
      )}
    </>
  );
};
