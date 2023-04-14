import React, { useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components';
import { Journalposttype } from '@app/components/journalposttype/journalposttype';
import { isoDateToPretty } from '@app/domain/date';
import { useFullTemaNameFromId } from '@app/hooks/kodeverk';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { DocumentViewerContext } from '@app/pages/create/document-viewer-context';
import { useKlageenheter } from '@app/simple-api-state/use-kodeverk';
import { IArkivertDocument, JournalposttypeEnum } from '@app/types/dokument';
import { AttachmentList } from './attachment-list';
import { formatAvsenderMottaker } from './avsender-mottaker';
import { DocumentTitle } from './document-title';
import { SelectDocument } from './select-document';
import { GridArea, GridTag, StyledField, StyledGrid } from './styled-grid-components';

interface Props {
  dokument: IArkivertDocument;
}

export const Dokument = ({ dokument }: Props) => {
  const { journalpost, setJournalpost } = useContext(ApiContext);
  const { viewDokument } = useContext(DocumentViewerContext);
  const { dokumentInfoId, journalpostId, tittel, registrert, temaId, sak, journalposttype } = dokument;

  const temaName = useFullTemaNameFromId(temaId);

  const isSelected = journalpost?.journalpostId === journalpostId;

  const selectJournalpost = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (dokument.harTilgangTilArkivvariant) {
        if (!dokument.alreadyUsed) {
          setJournalpost(dokument);
        }
        viewDokument(dokument);
      } else {
        viewDokument(null);
        setJournalpost(null);
      }
    },
    [dokument, setJournalpost, viewDokument]
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
        <AvsenderMottakerNotatforer {...dokument} />
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

type AvsenderMottakerProps = Pick<
  IArkivertDocument,
  'journalposttype' | 'avsenderMottaker' | 'journalfortAvNavn' | 'journalfoerendeEnhet'
>;

const AvsenderMottakerNotatforer = ({
  journalposttype,
  avsenderMottaker,
  journalfortAvNavn,
  journalfoerendeEnhet,
}: AvsenderMottakerProps) => {
  const { data: enheter } = useKlageenheter();
  const enhetNavn = useMemo(
    () => enheter?.find((enhet) => enhet.id === journalfoerendeEnhet)?.navn,
    [enheter, journalfoerendeEnhet]
  );

  const [text, title] = useMemo<[string, string | undefined]>(() => {
    if (journalposttype === JournalposttypeEnum.NOTAT) {
      if (journalfortAvNavn === null) {
        if (typeof enhetNavn === 'string') {
          return [enhetNavn, undefined];
        }

        return ['Ukjent', undefined];
      }

      return [journalfortAvNavn, enhetNavn];
    }

    return [formatAvsenderMottaker(avsenderMottaker), undefined];
  }, [avsenderMottaker, enhetNavn, journalfortAvNavn, journalposttype]);

  return (
    <StyledField $gridArea={GridArea.AVSENDER_MOTTAKER} title={title}>
      {text}
    </StyledField>
  );
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
