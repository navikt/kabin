import { getMulighetDate } from '@app/components/muligheter/common/mulighet-date';
import { useAdditionalKabalMulighet } from '@app/hooks/use-additional-kabal-mulighet';
import { useMulighet } from '@app/hooks/use-mulighet';

/**
 * The relevant date of the selected mulighet - `kjennelseMottatt` for begjæring om gjenopptak and
 * `vedtakDate` for every other type. Prefers the additional Kabal mulighet when one is selected,
 * like `useBasemulighetProp` and `useOtherMulighetProp`.
 *
 * `null` when the mulighet is based on a journalpost, since that has no date to derive.
 */
export const useMulighetDate = (): string | null => {
  const { mulighet, fromJournalpost } = useMulighet();
  const additionalKabalMulighet = useAdditionalKabalMulighet();

  if (fromJournalpost) {
    return null;
  }

  const additionalDate = additionalKabalMulighet === null ? null : getMulighetDate(additionalKabalMulighet);
  const mulighetDate = mulighet === undefined ? null : getMulighetDate(mulighet);

  return additionalDate ?? mulighetDate;
};
