import { isoDateToPretty } from '@app/domain/date';
import { useRegistrering } from '@app/hooks/use-registrering';
import { CalculatorIcon } from '@navikt/aksel-icons';
import { BodyShort, Tooltip } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const Fristdato = () => {
  const { overstyringer } = useRegistrering();
  const { calculatedFrist } = overstyringer;

  return (
    <Tooltip content="Beregnet fristdato">
      <BodyShort as="time" dateTime={calculatedFrist ?? ''}>
        <Content>
          <CalculatorIcon aria-hidden />
          {isoDateToPretty(calculatedFrist) ?? '-'}
        </Content>
      </BodyShort>
    </Tooltip>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 4px;
  color: var(--ax-text-neutral-subtle);
`;
