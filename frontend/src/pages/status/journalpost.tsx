import { ReadOnlyLogiskeVedlegg } from '@app/components/documents/document/logiske-vedlegg/read-only/logiske-vedlegg-list';
import { isoDateTimeToPrettyDate } from '@app/domain/date';
import { FORMAT } from '@app/domain/date-formats';
import { useFullTemaNameFromId } from '@app/hooks/kodeverk';
import { AvsenderMottaker, InfoItem, Sak, Time } from '@app/pages/status/common-components';
import { StyledCard } from '@app/pages/status/layout';
import { type IArkivertDocument, JournalposttypeEnum } from '@app/types/dokument';
import { BodyShort, Tag } from '@navikt/ds-react';

interface JournalpostProps {
  title: string;
  journalpost: IArkivertDocument;
}

export const Journalpost = ({ title, journalpost }: JournalpostProps) => {
  const { temaId, tittel, datoOpprettet, avsenderMottaker, sak, vedlegg, journalposttype, logiskeVedlegg } =
    journalpost;

  const temaName = useFullTemaNameFromId(temaId);

  return (
    <StyledCard title={title} gridArea="journalpost" titleSize="medium">
      <InfoItem label="Tittel">{tittel ?? '-'}</InfoItem>

      <InfoItem label="Tema">
        <Tag variant="alt3" className="w-fit max-w-full">
          <div className="truncate" title={temaName}>
            {temaName}
          </div>
        </Tag>
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
          <ul className="pl-4" data-testid="status-journalpost-vedlegg-list">
            {vedlegg.map((v) => (
              <li key={v.dokumentInfoId} className="text-lg">
                <span>{v.tittel ?? 'Ingen tittel'}</span>
                <ReadOnlyLogiskeVedlegg logiskeVedlegg={v.logiskeVedlegg} />
              </li>
            ))}
          </ul>
        )}
      </InfoItem>
    </StyledCard>
  );
};

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
