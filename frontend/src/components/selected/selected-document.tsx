import { Expand } from '@navikt/ds-icons';
import { Button, Detail, Heading, Label, Tag } from '@navikt/ds-react';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { isoDateToPretty } from '../../domain/date';
import { useFullTemaNameFromId } from '../../hooks/kodeverk';
import { AnkeContext } from '../../pages/create/anke-context';
import { DocumentViewerContext } from '../../pages/create/document-viewer-context';
import { IArkivertDocument, IJournalposttype } from '../../types/dokument';
import { Card } from '../card/card';
import { formatAvsenderMottaker } from '../documents/avsender-mottaker';
import { Journalposttype } from '../journalposttype/journalposttype';

interface Props {
  onClick: () => void;
}

export const SelectedDocument = ({ onClick }: Props) => {
  const { dokument } = useContext(AnkeContext);

  if (dokument === null) {
    return null;
  }

  return <RenderDokument dokument={dokument} onClick={onClick} />;
};

interface RenderProps extends Props {
  dokument: IArkivertDocument;
}

const RenderDokument = ({ dokument, onClick }: RenderProps) => {
  const { tittel, tema, registrert, avsenderMottaker, journalposttype, sak, vedlegg } = dokument;

  const temaName = useFullTemaNameFromId(tema);

  return (
    <Card>
      <Header>
        <Heading size="small" level="1">
          Valgt journalpost
        </Heading>
        <Button
          size="small"
          variant="tertiary-neutral"
          onClick={onClick}
          icon={<Expand aria-hidden />}
          title="Vis alle journalposter"
        />
      </Header>
      <DocumentLine>
        <Column>
          <Label size="small">Tittel</Label>
          <Detail>{tittel}</Detail>
        </Column>
        <Column>
          <Label size="small">Antall vedlegg</Label>
          <Detail>{vedlegg.length}</Detail>
        </Column>
        <Column>
          <Label size="small">Tema</Label>
          <Tag variant="alt3" size="small" title={temaName}>
            <Ellipsis>{temaName}</Ellipsis>
          </Tag>
        </Column>
        <Column>
          <Label size="small">Dato</Label>
          <Detail as="time" dateTime={registrert}>
            {isoDateToPretty(registrert) ?? ''}
          </Detail>
        </Column>
        <AvsenderMottaker journalposttype={journalposttype} avsenderMottaker={avsenderMottaker} />
        <Column>
          <Label size="small">Saks-ID</Label>
          <Detail>{sak?.fagsakId ?? 'Ingen'}</Detail>
        </Column>
        <Column>
          <Label size="small">Type</Label>
          <Journalposttype journalposttype={journalposttype} />
        </Column>
        <ViewDocumentButton dokument={dokument} />
      </DocumentLine>
    </Card>
  );
};

interface VirewDocumentButtonProps {
  dokument: IArkivertDocument;
}

const ViewDocumentButton = ({ dokument }: VirewDocumentButtonProps) => {
  const { dokument: viewedDokument, viewDokument } = useContext(DocumentViewerContext);

  if (
    viewedDokument?.dokumentInfoId === dokument.dokumentInfoId &&
    viewedDokument?.journalpostId === dokument.journalpostId
  ) {
    return null;
  }

  return (
    <Button size="small" onClick={() => viewDokument(dokument)}>
      Se dokument
    </Button>
  );
};

type AvsenderMottakerProps = Pick<IArkivertDocument, 'journalposttype' | 'avsenderMottaker'>;

const AvsenderMottaker = ({ journalposttype, avsenderMottaker }: AvsenderMottakerProps) => {
  if (journalposttype === IJournalposttype.NOTAT) {
    return null;
  }

  const title = journalposttype === IJournalposttype.INNGAAENDE ? 'Mottaker' : 'Avsender';

  return (
    <Column>
      <Label size="small">{title}</Label>
      <Detail>{formatAvsenderMottaker(avsenderMottaker)}</Detail>
    </Column>
  );
};

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const DocumentLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  column-gap: 16px;
  background-color: var(--a-blue-50);
  border: 1px solid var(--a-blue-200);
  padding: 16px;
  border-radius: 4px;
`;

const Ellipsis = styled.div`
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
