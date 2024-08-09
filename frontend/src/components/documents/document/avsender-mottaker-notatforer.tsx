import { useMemo } from 'react';
import { formatAvsenderMottaker } from '@app/components/documents/avsender-mottaker';
import { GridArea, StyledField } from '@app/components/documents/styled-grid-components';
import { useGetKlageenheterQuery } from '@app/redux/api/kodeverk';
import { IArkivertDocument, JournalposttypeEnum } from '@app/types/dokument';

type AvsenderMottakerProps = Pick<
  IArkivertDocument,
  'journalposttype' | 'avsenderMottaker' | 'journalfortAvNavn' | 'journalfoerendeEnhet'
>;

export const AvsenderMottakerNotatforer = ({
  journalposttype,
  avsenderMottaker,
  journalfortAvNavn,
  journalfoerendeEnhet,
}: AvsenderMottakerProps) => {
  const { data: enheter } = useGetKlageenheterQuery();
  const enhetNavn = useMemo(
    () => enheter?.find((enhet) => enhet.id === journalfoerendeEnhet)?.navn,
    [enheter, journalfoerendeEnhet],
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
