import { FilterList } from '@app/components/filter-dropdown/filter-list';
import { Header } from '@app/components/filter-dropdown/header';
import type { BaseProps, DropdownProps } from '@app/components/filter-dropdown/props';
import { type JSX, useEffect, useState } from 'react';
import { styled } from 'styled-components';

interface Props<T extends string> extends BaseProps<T>, DropdownProps {}

const INITIAL_FILTER = /.*/;

export const Dropdown = <T extends string>({
  selected,
  options,
  isOpen,
  onChange,
  closeDropdown,
}: Props<T>): JSX.Element => {
  const [filter, setFilter] = useState<RegExp>(INITIAL_FILTER);
  const [focused, setFocused] = useState(-1);
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    setFilteredOptions(options.filter(({ label }) => filter.test(label)));
  }, [options, filter]);

  useEffect(() => {
    if (!isOpen && focused !== -1) {
      setFocused(-1);
    }
  }, [isOpen, focused]);

  const reset = () => onChange([]);

  const onSelectFocused = () => {
    const filteredFocused = filteredOptions[focused];

    if (filteredFocused === undefined) {
      return;
    }

    const { value } = filteredFocused;
    const isSelected = selected.includes(value);

    if (isSelected) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const focusedOption = filteredOptions[focused] ?? null;

  return (
    <StyledDropdown data-testid="filter-dropdown">
      <Header
        onFocusChange={setFocused}
        onFilterChange={setFilter}
        onSelect={onSelectFocused}
        focused={focused}
        onReset={reset}
        optionsCount={options.length}
        closeDropdown={closeDropdown}
        showFjernAlle
      />
      <FilterList options={filteredOptions} selected={selected} onChange={onChange} focused={focusedOption} />
    </StyledDropdown>
  );
};

const StyledDropdown = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  border-radius: 4px;
  z-index: 1;
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow-y: auto;
`;
