import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, HStack, Tooltip } from '@navikt/ds-react';

interface Props {
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

/** Keyboard- and screen reader accessible equivalent of dragging a row up or down. Always
 * rendered (disabled at the ends of the list) so the rows stay aligned with each other. */
export const MoveDokumentButtons = ({ onMoveUp, onMoveDown, canMoveUp, canMoveDown }: Props) => (
  <HStack wrap={false}>
    <Tooltip content="Flytt opp" delay={500}>
      <Button
        size="xsmall"
        variant="tertiary-neutral"
        icon={<ChevronUpIcon aria-hidden />}
        onClick={onMoveUp}
        disabled={!canMoveUp}
      />
    </Tooltip>

    <Tooltip content="Flytt ned" delay={500}>
      <Button
        size="xsmall"
        variant="tertiary-neutral"
        icon={<ChevronDownIcon aria-hidden />}
        onClick={onMoveDown}
        disabled={!canMoveDown}
      />
    </Tooltip>
  </HStack>
);
