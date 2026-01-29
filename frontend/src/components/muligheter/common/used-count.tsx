import { isoDateTimeToPretty } from '@app/domain/date';
import { TYPE_NAME } from '@app/types/common';
import type { ExistingBehandling } from '@app/types/mulighet';
import { Tag, Tooltip } from '@navikt/ds-react';

interface Props {
  sourceOfExistingBehandlinger: ExistingBehandling[];
}

export const UsedCount = ({ sourceOfExistingBehandlinger }: Props) => {
  const usedCount = sourceOfExistingBehandlinger.length;

  if (usedCount === 0) {
    return null;
  }

  return (
    <Tooltip content={tooltipContent(sourceOfExistingBehandlinger)} className="whitespace-pre-wrap text-left">
      <Tag variant="warning" size="small" className="whitespace-nowrap">
        Brukt {usedCount} gang{usedCount !== 1 ? 'er' : ''}
      </Tag>
    </Tooltip>
  );
};

const tooltipContent = (sourceOfExistingBehandlinger: ExistingBehandling[]) =>
  sourceOfExistingBehandlinger
    .toSorted((a, b) => b.created.localeCompare(a.created))
    .map(({ typeId, created }) => `${TYPE_NAME[typeId]} registrert ${isoDateTimeToPretty(created)}`)
    .join('\n');
