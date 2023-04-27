import { Tag } from '@navikt/ds-react';
import React from 'react';
import { isoDateTimeToPretty, isoDateToPretty } from '@app/domain/date';
import { useUtfallName, useYtelseName } from '@app/hooks/kodeverk';
import { InfoItem, Part, Sak } from '@app/pages/status/common-components';
import { StyledCard } from '@app/pages/status/styled-components';
import { IPart } from '@app/types/common';
import { UtfallEnum } from '@app/types/kodeverk';

interface Props {
  fagsakId: string;
  fagsystemId: string;
  sakenGjelder: IPart;
  title: string;
  utfallId: UtfallEnum;
  vedtakDate: string;
  ytelseId: string;
}

export const Mulighet = ({ title, sakenGjelder, ytelseId, utfallId, vedtakDate, fagsystemId, fagsakId }: Props) => {
  const ytelse = useYtelseName(ytelseId);
  const utfall = useUtfallName(utfallId);

  return (
    <StyledCard title={title} $gridArea="mulighet" titleSize="medium">
      <Part title="Saken gjelder" part={sakenGjelder} />

      <InfoItem label="Vedtaksdato">
        {isoDateToPretty(vedtakDate) ?? isoDateTimeToPretty(vedtakDate) ?? vedtakDate}
      </InfoItem>

      <InfoItem label="Ytelse">
        <Tag variant="alt3">{ytelse}</Tag>
      </InfoItem>
      <InfoItem label="Utfall">
        <Tag variant="alt1">{utfall}</Tag>
      </InfoItem>

      <Sak sak={{ fagsakId, fagsystemId }} />
    </StyledCard>
  );
};
