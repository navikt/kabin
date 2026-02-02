import { isoDateToPretty } from '@app/domain/date';
import { CalculatorIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, Tooltip } from '@navikt/ds-react';

export const Fristdato = ({ date }: { date: string | null }) => (
  <Tooltip content="Beregnet dato">
    <BodyShort as="time" dateTime={date ?? ''} className="min-h">
      <HStack align="center" gap="space-4" wrap={false} className="text-ax-text-neutral-subtle">
        <CalculatorIcon aria-hidden />
        {isoDateToPretty(date) ?? '-'}
      </HStack>
    </BodyShort>
  </Tooltip>
);
