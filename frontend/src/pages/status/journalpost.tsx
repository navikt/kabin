import { BodyShort, Tag } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { isoDateToPretty } from '../../domain/date';
import { useFullTemaNameFromId } from '../../hooks/kodeverk';
import { IArkivertDocument, IAvsenderMottaker, IJournalposttype } from '../../types/dokument';
import { InfoItem, Sak, Time } from './common-components';

interface JournalpostProps {
  journalpost: IArkivertDocument;
}

export const Journalpost = ({ journalpost }: JournalpostProps) => {
  const { tema, tittel, registrert, avsenderMottaker, sak, vedlegg, journalposttype } = journalpost;

  const temaName = useFullTemaNameFromId(tema);

  return (
    <>
      <InfoItem label="Tittel">{tittel ?? '-'}</InfoItem>

      <InfoItem label="Tema">
        <StyledTag variant="alt3">
          <Ellipsis title={temaName}>{temaName}</Ellipsis>
        </StyledTag>
      </InfoItem>

      <InfoItem label="Dato">
        <Time dateTime={registrert}>{isoDateToPretty(registrert) ?? registrert}</Time>
      </InfoItem>

      <InfoItem label="Avsender/mottaker">{getAvsenderMottaker(avsenderMottaker)}</InfoItem>

      <Sak sak={sak} />
      <InfoItem label="Type">{getJournalposttype(journalposttype)}</InfoItem>

      <InfoItem label="Vedlegg">
        {vedlegg.length === 0 ? (
          <BodyShort>Ingen</BodyShort>
        ) : (
          <List>
            {vedlegg.map(({ tittel: t, dokumentInfoId }) => (
              <ListItem key={dokumentInfoId}>{t ?? 'Ingen tittel'}</ListItem>
            ))}
          </List>
        )}
      </InfoItem>
    </>
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

const getAvsenderMottaker = (avsenderMottaker: IAvsenderMottaker) => {
  if (avsenderMottaker.id === null) {
    return 'Ingen';
  }

  return avsenderMottaker.navn ?? 'Navn mangler';
};

const getJournalposttype = (type: IJournalposttype) => {
  switch (type) {
    case IJournalposttype.INNGAAENDE:
      return 'Inngående';
    case IJournalposttype.UTGAAENDE:
      return 'Utgående';
    case IJournalposttype.NOTAT:
      return 'Notat';
  }
};
