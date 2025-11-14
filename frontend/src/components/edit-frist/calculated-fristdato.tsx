import { isoDateToPretty } from '@app/domain/date';
import { CalculatorIcon } from '@navikt/aksel-icons';
import { BodyShort, Tooltip } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const Fristdato = ({ date }: { date: string | null }) => (
  <Tooltip content="Beregnet dato">
    <BodyShort as="time" dateTime={date ?? ''} className="min-h">
      <Content>
        <CalculatorIcon aria-hidden />
        {isoDateToPretty(date) ?? '-'}
      </Content>
    </BodyShort>
  </Tooltip>
);

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 4px;
  color: var(--ax-text-neutral-subtle);
`;
