import { ReadOnlyLogiskeVedlegg } from '@app/components/documents/document/logiske-vedlegg/read-only/logiske-vedlegg-list';
import { isoDateTimeToPrettyDate } from '@app/domain/date';
import { FORMAT } from '@app/domain/date-formats';
import { useFullTemaNameFromId } from '@app/hooks/kodeverk';
import { AvsenderMottaker, InfoItem, Sak, Time } from '@app/pages/status/common-components';
import { StyledCard } from '@app/pages/status/styled-components';
import { type IArkivertDocument, JournalposttypeEnum } from '@app/types/dokument';
import { BodyShort, Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface JournalpostProps {
  title: string;
  journalpost: IArkivertDocument;
}

export const Journalpost = ({ title, journalpost }: JournalpostProps) => {
  const { temaId, tittel, datoOpprettet, avsenderMottaker, sak, vedlegg, journalposttype, logiskeVedlegg } =
    journalpost;

  const temaName = useFullTemaNameFromId(temaId);

  return (
    <StyledCard title={title} $gridArea="journalpost" titleSize="medium">
      <InfoItem label="Tittel">{tittel ?? '-'}</InfoItem>

      <InfoItem label="Tema">
        <StyledTag variant="alt3">
          <Ellipsis title={temaName}>{temaName}</Ellipsis>
        </StyledTag>
      </InfoItem>

      <InfoItem label="Dato">
        <Time dateTime={datoOpprettet}>
          {isoDateTimeToPrettyDate(datoOpprettet) ?? datoOpprettet.substring(0, FORMAT.length)}
        </Time>
      </InfoItem>

      <AvsenderMottaker avsenderMottaker={avsenderMottaker} />

      <Sak sak={sak} />
      <InfoItem label="Type">{getJournalposttype(journalposttype)}</InfoItem>

      <InfoItem label="Logiske vedlegg">
        <ReadOnlyLogiskeVedlegg logiskeVedlegg={logiskeVedlegg} />
      </InfoItem>

      <InfoItem label="Vedlegg">
        {vedlegg.length === 0 ? (
          <BodyShort>Ingen vedlegg</BodyShort>
        ) : (
          <List data-testid="status-journalpost-vedlegg-list">
            {vedlegg.map((v) => (
              <ListItem key={v.dokumentInfoId}>
                <span>{v.tittel ?? 'Ingen tittel'}</span>
                <ReadOnlyLogiskeVedlegg logiskeVedlegg={v.logiskeVedlegg} />
              </ListItem>
            ))}
          </List>
        )}
      </InfoItem>
    </StyledCard>
  );
};

const List = styled.ul`
  margin: 0;
  padding: 0;
  padding-left: 16px;
`;

const ListItem = styled.li`
  font-size: 18px;
`;

const StyledTag = styled(Tag)`
  width: fit-content;
  max-width: 100%;
`;

const Ellipsis = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const getJournalposttype = (type: JournalposttypeEnum) => {
  switch (type) {
    case JournalposttypeEnum.INNGAAENDE:
      return 'Inngående';
    case JournalposttypeEnum.UTGAAENDE:
      return 'Utgående';
    case JournalposttypeEnum.NOTAT:
      return 'Notat';
  }
};
