import { YtelseTag } from '@app/components/ytelse-tag/ytelse-tag';
import { isoDateTimeToPretty, isoDateToPretty } from '@app/domain/date';
import { InfoItem, Part, Sak } from '@app/pages/status/common-components';
import { StyledCard } from '@app/pages/status/layout';
import type { IPart } from '@app/types/common';

interface Props {
  fagsakId: string;
  fagsystemId: string;
  sakenGjelder: IPart;
  title: string;
  mulighetDate: string | null;
  mulighetDateLabel: string;
  ytelseId: string;
}

export const Mulighet = ({
  title,
  sakenGjelder,
  ytelseId,
  mulighetDate,
  fagsystemId,
  fagsakId,
  mulighetDateLabel,
}: Props) => (
  <StyledCard title={title} gridArea="mulighet" titleSize="medium">
    <Part title="Saken gjelder" part={sakenGjelder} />

    <InfoItem label={mulighetDateLabel}>
      {mulighetDate === null
        ? 'Ukjent'
        : (isoDateToPretty(mulighetDate) ?? isoDateTimeToPretty(mulighetDate) ?? mulighetDate)}
    </InfoItem>

    <InfoItem label="Ytelse">
      <YtelseTag ytelseId={ytelseId} />
    </InfoItem>

    <Sak sak={{ fagsakId, fagsystemId }} />
  </StyledCard>
);
