import { Filter } from '@app/components/filter-dropdown/option';
import type { BaseProps } from '@app/components/filter-dropdown/props';

export const FilterList = <T extends string>({ selected, options, focused, onChange }: BaseProps<T>) => {
  const setSelected = (value: T, active: boolean) => {
    const selectedOptions: T[] = active
      ? [...selected, value]
      : selected.filter((selectedValue: string) => selectedValue !== value);

    onChange(selectedOptions);
  };

  return (
    <ul className="shrink grow list-none overflow-y-auto overflow-x-hidden" data-testid="filter-list">
      {options.map(({ value, label }) => (
        <li key={value} className="w-full pl-2" data-testid="filter-list-item" data-filterid={value}>
          <Filter
            active={selected.includes(value)}
            filterId={value}
            onChange={setSelected}
            focused={value === focused?.value}
          >
            {label}
          </Filter>
        </li>
      ))}
    </ul>
  );
};
