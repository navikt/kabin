import { styled } from 'styled-components';
import { Attachment } from '@app/components/documents/document/attachment';
import { EditableLogiskeVedlegg } from '@app/components/documents/document/logiske-vedlegg/editable/logiske-vedlegg-list';
import { ReadOnlyLogiskeVedlegg } from '@app/components/documents/document/logiske-vedlegg/read-only/logiske-vedlegg-list';
import { IArkivertDocument } from '@app/types/dokument';

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
        <EditableLogiskeVedlegg
          logiskeVedlegg={logiskeVedlegg}
          dokumentInfoId={dokumentInfoId}
          temaId={temaId}
          $inset
        />
      ) : (
        <ReadOnlyLogiskeVedlegg logiskeVedlegg={logiskeVedlegg} $inset />
      )}
      {vedlegg.length === 0 ? null : (
        <StyledAttachmentList data-testid="documents-vedlegg-list" aria-label="Vedlegg">
          {vedlegg.map((v) => (
            <Attachment key={`vedlegg_${journalpostId}_${v.dokumentInfoId}`} vedlegg={v} dokument={dokument} />
          ))}
        </StyledAttachmentList>
      )}
    </>
  );
};

const StyledAttachmentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding: 0;
  margin: 0;
  margin-left: 16px;
  list-style-type: none;
`;
