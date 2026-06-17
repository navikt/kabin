import { formatAvsenderMottaker } from '@app/components/documents/avsender-mottaker';
import { CustomTooltipField, GridArea } from '@app/components/documents/styled-grid-components';
import { useGetKlageenheterQuery } from '@app/redux/api/kodeverk';
import { type IArkivertDocument, JournalposttypeEnum } from '@app/types/dokument';
import { useMemo } from 'react';

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

  const [text, tooltip] = useMemo<[string, string]>(() => {
    if (journalposttype === JournalposttypeEnum.NOTAT) {
      if (journalfortAvNavn === null) {
        if (typeof enhetNavn === 'string') {
          return [enhetNavn, enhetNavn];
        }

        return ['Ukjent', 'Ukjent'];
      }

      return [journalfortAvNavn, `${journalfortAvNavn}${enhetNavn === undefined ? '' : ` (${enhetNavn})`}`];
    }

    const formatted = formatAvsenderMottaker(avsenderMottaker);

    return [formatted, formatted];
  }, [avsenderMottaker, enhetNavn, journalfortAvNavn, journalposttype]);

  return (
    <CustomTooltipField gridArea={GridArea.AVSENDER_MOTTAKER} tooltip={tooltip}>
      {text}
    </CustomTooltipField>
  );
};
