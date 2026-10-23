import { isoDateToPretty } from '@app/domain/date';
import { useGetSakstyperQuery } from '@app/redux/api/kodeverk';
import type { ExistingBehandling } from '@app/types/mulighet';
import { Tag, Tooltip } from '@navikt/ds-react';

interface Props {
  sourceOfExistingBehandlinger: ExistingBehandling[];
}

export const UsedCount = ({ sourceOfExistingBehandlinger }: Props) => {
  const usedCount = sourceOfExistingBehandlinger.length;
  const content = useTooltipContent(sourceOfExistingBehandlinger);

  if (usedCount === 0) {
    return null;
  }

  return (
    <Tooltip content={content} maxChar={Number.POSITIVE_INFINITY} className="whitespace-pre-wrap text-left">
      <Tag variant="warning" size="small" className="whitespace-nowrap">
        Brukt {usedCount} gang{usedCount !== 1 ? 'er' : ''}
      </Tag>
    </Tooltip>
  );
};

const useTooltipContent = (sourceOfExistingBehandlinger: ExistingBehandling[]) => {
  const { data = [] } = useGetSakstyperQuery();

  return sourceOfExistingBehandlinger
    .toSorted((a, b) => b.created.localeCompare(a.created))
    .map(({ typeId, created }) => {
      const [date, time] = created.split('T');
      const typeName = data.find(({ id }) => id === typeId)?.navn ?? typeId;

      return `${typeName} registrert ${isoDateToPretty(date)} kl. ${time?.slice(0, 5) ?? '00:00'}`;
    })
    .join('\n');
};
