import { Tag } from '@navikt/ds-react';
import { isoDateTimeToPretty, isoDateToPretty } from '@app/domain/date';
import { useYtelseName } from '@app/hooks/kodeverk';
import { InfoItem, Part, Sak } from '@app/pages/status/common-components';
import { StyledCard } from '@app/pages/status/styled-components';
import { IPart } from '@app/types/common';

interface Props {
  fagsakId: string;
  fagsystemId: string;
  sakenGjelder: IPart;
  title: string;
  vedtakDate: string | null;
  ytelseId: string;
}

export const Mulighet = ({ title, sakenGjelder, ytelseId, vedtakDate, fagsystemId, fagsakId }: Props) => {
  const ytelse = useYtelseName(ytelseId);

  return (
    <StyledCard title={title} $gridArea="mulighet" titleSize="medium">
      <Part title="Saken gjelder" part={sakenGjelder} />

      <InfoItem label="Vedtaksdato">
        {vedtakDate === null
          ? 'Ukjent'
          : (isoDateToPretty(vedtakDate) ?? isoDateTimeToPretty(vedtakDate) ?? vedtakDate)}
      </InfoItem>

      <InfoItem label="Ytelse">
        <Tag variant="alt3">{ytelse}</Tag>
      </InfoItem>

      <Sak sak={{ fagsakId, fagsystemId }} />
    </StyledCard>
  );
};
