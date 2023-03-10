import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';
import { isoDateToPretty } from '../../domain/date';
import { useFullTemaNameFromId } from '../../hooks/kodeverk';
import { AnkeContext } from '../../pages/create/anke-context';
import { DocumentViewerContext } from '../../pages/create/document-viewer-context';
import { IArkivertDocument, IJournalposttype } from '../../types/dokument';
import { Journalposttype } from '../journalposttype/journalposttype';
import { AttachmentList } from './attachment-list';
import { formatAvsenderMottaker } from './avsender-mottaker';
import { DocumentTitle } from './document-title';
import { SelectDocument } from './select-document';
import { GridArea, GridTag, StyledField, StyledGrid } from './styled-grid-components';

interface Props {
  dokument: IArkivertDocument;
}

export const Dokument = ({ dokument }: Props) => {
  const { dokument: selectedDokument, setDokument, setMottattNav } = useContext(AnkeContext);
  const { viewDokument } = useContext(DocumentViewerContext);
  const { dokumentInfoId, journalpostId, tittel, registrert, tema, avsenderMottaker, sak, journalposttype } = dokument;

  const temaName = useFullTemaNameFromId(tema);

  const isSelected = selectedDokument?.journalpostId === journalpostId;

  const selectJournalpost = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (dokument.harTilgangTilArkivvariant) {
        if (!dokument.alreadyUsed) {
          setDokument(dokument);
          setMottattNav(dokument.registrert);
        }
        viewDokument(dokument);
      } else {
        viewDokument(null);
        setDokument(null);
      }
    },
    [dokument, setDokument, setMottattNav, viewDokument]
  );

  return (
    <DocumentListItem $isSelected={isSelected} $clickable={dokument.harTilgangTilArkivvariant}>
      <StyledGrid
        as="article"
        onClick={selectJournalpost}
        data-testid="document"
        data-journalpostid={journalpostId}
        data-dokumentinfoid={dokumentInfoId}
        data-documentname={tittel}
      >
        <DocumentTitle
          journalpostId={journalpostId}
          dokumentInfoId={dokumentInfoId}
          tittel={tittel ?? ''}
          harTilgangTilArkivvariant={dokument.harTilgangTilArkivvariant}
        />
        <GridTag variant="alt3" size="medium" title={temaName} $gridArea={GridArea.TEMA}>
          <Ellipsis>{temaName}</Ellipsis>
        </GridTag>
        <StyledDate dateTime={registrert}>{isoDateToPretty(registrert)}</StyledDate>
        <AvsenderMottaker journalposttype={journalposttype} avsenderMottaker={avsenderMottaker} />
        <StyledField $gridArea={GridArea.SAKS_ID}>{sak?.fagsakId ?? 'Ingen'}</StyledField>
        <StyledField $gridArea={GridArea.TYPE}>
          <Journalposttype journalposttype={journalposttype} />
        </StyledField>
        <SelectDocument
          isSelected={isSelected}
          selectJournalpost={selectJournalpost}
          harTilgangTilArkivvariant={dokument.harTilgangTilArkivvariant}
          alreadyUsed={dokument.alreadyUsed}
        />
      </StyledGrid>
      <AttachmentList dokument={dokument} />
    </DocumentListItem>
  );
};

type AvsenderMottakerProps = Pick<IArkivertDocument, 'journalposttype' | 'avsenderMottaker'>;

const AvsenderMottaker = ({ journalposttype, avsenderMottaker }: AvsenderMottakerProps) => {
  if (journalposttype === IJournalposttype.NOTAT) {
    return null;
  }

  return <StyledField $gridArea={GridArea.AVSENDER_MOTTAKER}>{formatAvsenderMottaker(avsenderMottaker)}</StyledField>;
};

const DocumentListItem = styled.li<{ $isSelected: boolean; $clickable: boolean }>`
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  border-radius: 4px;
  background-color: ${({ $isSelected }) => ($isSelected ? 'var(--a-blue-50)' : 'var(--a-white)')};

  :nth-child(odd) {
    background-color: ${({ $isSelected }) => ($isSelected ? 'var(--a-blue-50)' : 'var(--a-surface-subtle)')};
  }

  :hover {
    background-color: ${({ $isSelected }) => ($isSelected ? 'var(--a-blue-100)' : 'var(--a-gray-100)')};
  }
`;

const Ellipsis = styled.div`
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  width: 100%;
`;

const StyledDate = styled.time`
  display: flex;
  align-items: center;
`;
