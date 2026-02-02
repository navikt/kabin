import { Card } from '@app/components/card/card';
import { formatAvsenderMottaker } from '@app/components/documents/avsender-mottaker';
import { Journalposttype } from '@app/components/journalposttype/journalposttype';
import { isoDateTimeToPrettyDate } from '@app/domain/date';
import { useFullTemaNameFromId } from '@app/hooks/kodeverk';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { DocumentViewerContext } from '@app/pages/registrering/document-viewer-context';
import { type IArkivertDocument, JournalposttypeEnum } from '@app/types/dokument';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { Button, Heading, HStack, Table, Tag } from '@navikt/ds-react';
import { useContext } from 'react';

interface Props {
  onClick?: () => void;
}

export const SelectedDocument = ({ onClick }: Props) => {
  const { journalpost } = useJournalpost();

  if (journalpost === undefined) {
    return null;
  }

  return <RenderDokument dokument={journalpost} onClick={onClick} />;
};

interface RenderProps extends Props {
  dokument: IArkivertDocument;
}

const RenderDokument = ({ dokument, onClick }: RenderProps) => {
  const { tittel, temaId, datoOpprettet, avsenderMottaker, journalposttype, sak, vedlegg } = dokument;

  const temaName = useFullTemaNameFromId(temaId);

  return (
    <Card>
      <HStack justify="space-between">
        <Heading size="small" level="1">
          Valgt journalpost
        </Heading>
        {onClick === undefined ? null : (
          <Button
            data-color="neutral"
            size="small"
            variant="tertiary"
            onClick={onClick}
            icon={<ChevronDownIcon aria-hidden />}
            title="Vis alle journalposter"
          />
        )}
      </HStack>
      <Table zebraStripes size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Tittel</Table.HeaderCell>
            <Table.HeaderCell>Antall vedlegg</Table.HeaderCell>
            <Table.HeaderCell>Tema</Table.HeaderCell>
            <Table.HeaderCell>Dato</Table.HeaderCell>
            <Table.HeaderCell>{getAvsenderMottakerTitle(journalposttype)}</Table.HeaderCell>
            <Table.HeaderCell>Saks-ID</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.DataCell>{tittel}</Table.DataCell>
            <Table.DataCell>{vedlegg.length}</Table.DataCell>
            <Table.DataCell>
              <Tag className="max-w-37.5" variant="alt3" size="small" title={temaName}>
                <div className="w-full truncate text-left">{temaName}</div>
              </Tag>
            </Table.DataCell>
            <Table.DataCell>
              <time dateTime={datoOpprettet}>{isoDateTimeToPrettyDate(datoOpprettet) ?? ''}</time>
            </Table.DataCell>
            <Table.DataCell>{formatAvsenderMottaker(avsenderMottaker)}</Table.DataCell>
            <Table.DataCell>{sak?.fagsakId ?? 'Ingen'}</Table.DataCell>
            <Table.DataCell>
              <Journalposttype journalposttype={journalposttype} />
            </Table.DataCell>
            <Table.DataCell>
              <ViewDocumentButton dokument={dokument} />
            </Table.DataCell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Card>
  );
};

interface VirewDocumentButtonProps {
  dokument: IArkivertDocument;
}

const ViewDocumentButton = ({ dokument }: VirewDocumentButtonProps) => {
  const { dokument: viewedDokument, viewDokument } = useContext(DocumentViewerContext);

  const isViewing =
    viewedDokument !== null &&
    viewedDokument.dokumentInfoId === dokument.dokumentInfoId &&
    viewedDokument.journalpostId === dokument.journalpostId;

  return (
    <Button className="mt-auto w-33.75" size="small" onClick={() => viewDokument(isViewing ? null : dokument)}>
      {isViewing ? 'Skjul dokument' : 'Vis dokument'}
    </Button>
  );
};

const getAvsenderMottakerTitle = (journalposttype: JournalposttypeEnum) => {
  switch (journalposttype) {
    case JournalposttypeEnum.INNGAAENDE:
      return 'Avsender';
    case JournalposttypeEnum.UTGAAENDE:
      return 'Mottaker';
    case JournalposttypeEnum.NOTAT:
      return null;
  }
};
