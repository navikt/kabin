import { stringToRegExp } from '@app/functions/string-to-regex';
import { TrashIcon } from '@navikt/aksel-icons';
import { Button, Search } from '@navikt/ds-react';
import { type KeyboardEventHandler, useRef } from 'react';
import { styled } from 'styled-components';

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
    <StyledHeader>
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
        <StyledButton size="xsmall" variant="danger" onClick={onReset} icon={<TrashIcon aria-hidden />}>
          Fjern alle
        </StyledButton>
      )}
    </StyledHeader>
  );
};

const StyledButton = styled(Button)`
  margin-left: 0.5em;
  flex-shrink: 0;
`;

const StyledHeader = styled.div`
  position: sticky;
  top: 0;
  border-bottom: 1px solid #c6c2bf;
  background-color: white;
  padding: 8px;
  display: flex;
  justify-content: space-between;
`;
