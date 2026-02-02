import { stringToRegExp } from '@app/functions/string-to-regex';
import { TrashIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack, Search } from '@navikt/ds-react';
import { type JSX, type KeyboardEventHandler, useRef } from 'react';

interface HeaderProps {
  focused: number;
  optionsCount: number;
  showFjernAlle?: boolean;
  closeDropdown: () => void;
  onReset: () => void;
  onFocusChange: (focused: number) => void;
  onSelect: () => void;
  onFilterChange: (query: RegExp) => void;
}

export const Header = ({
  optionsCount,
  onSelect,
  focused,
  onFocusChange,
  onFilterChange,
  closeDropdown,
  onReset,
  showFjernAlle = true,
}: HeaderProps): JSX.Element | null => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onInputChange = (value: string) => onFilterChange(stringToRegExp(value));

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Escape') {
      onFocusChange(-1);

      return closeDropdown();
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();

      if (focused === optionsCount - 1) {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

        return onFocusChange(-1);
      }

      return onFocusChange(focused + 1);
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();

      if (focused === -1) {
        return onFocusChange(optionsCount - 1);
      }

      if (focused === 0) {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      return onFocusChange(focused - 1);
    }

    if (e.key === 'Enter' || (e.key === ' ' && focused !== -1)) {
      if (focused < optionsCount && focused !== -1) {
        e.preventDefault();
        onSelect();
      }
    }
  };

  return (
    <Box asChild borderColor="neutral" borderWidth="0 0 1 0" padding="space-8">
      <HStack justify="space-between" position="sticky" top="space-0" wrap={false}>
        <Search
          onChange={onInputChange}
          defaultValue=""
          placeholder="Søk"
          label="Søk"
          hideLabel
          onKeyDown={onKeyDown}
          autoFocus
          size="small"
          variant="simple"
          ref={inputRef}
          data-testid="header-filter"
        />
        {showFjernAlle && (
          <Button
            className="ml-2 shrink-0"
            size="xsmall"
            variant="danger"
            onClick={onReset}
            icon={<TrashIcon aria-hidden />}
          >
            Fjern alle
          </Button>
        )}
      </HStack>
    </Box>
  );
};
