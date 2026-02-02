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
  vedtakDate: string | null;
  ytelseId: string;
}

export const Mulighet = ({ title, sakenGjelder, ytelseId, vedtakDate, fagsystemId, fagsakId }: Props) => (
  <StyledCard title={title} gridArea="mulighet" titleSize="medium">
    <Part title="Saken gjelder" part={sakenGjelder} />

    <InfoItem label="Vedtaksdato">
      {vedtakDate === null ? 'Ukjent' : (isoDateToPretty(vedtakDate) ?? isoDateTimeToPretty(vedtakDate) ?? vedtakDate)}
    </InfoItem>

    <InfoItem label="Ytelse">
      <YtelseTag ytelseId={ytelseId} />
    </InfoItem>

    <Sak sak={{ fagsakId, fagsystemId }} />
  </StyledCard>
);
