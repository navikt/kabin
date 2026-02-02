import { Button } from '@navikt/ds-react';
import { useEffect, useRef } from 'react';

interface BaseProps {
  onSelect: (suggestion: string) => void;
}

interface Props extends BaseProps {
  suggestions: string[];
  activeIndex: number;
}

export const Suggestions = ({ suggestions, activeIndex, onSelect }: Props) =>
  suggestions.length === 0 ? (
    <ul className="absolute top-full right-0 left-0 z-2 max-h-50 w-fit max-w-100 list-none overflow-y-auto overflow-x-hidden rounded bg-ax-bg-default shadow-ax-shadow-dialog">
      <li>
        <Button
          className="w-full cursor-pointer justify-start overflow-hidden"
          size="xsmall"
          variant="tertiary-neutral"
        >
          <span className="block w-full truncate text-left font-normal italic">Ingen forslag</span>
        </Button>
      </li>
    </ul>
  ) : (
    <ul className="absolute top-full right-0 left-0 z-2 max-h-50 w-fit max-w-100 list-none overflow-y-auto overflow-x-hidden rounded bg-ax-bg-default shadow-ax-shadow-dialog">
      {suggestions.map((suggestion, i) => (
        <Suggestion key={suggestion} isActive={i === activeIndex} suggestion={suggestion} onSelect={onSelect} />
      ))}
    </ul>
  );

interface SuggestionProps extends BaseProps {
  suggestion: string;
  isActive: boolean;
}

const Suggestion = ({ suggestion, isActive, onSelect }: SuggestionProps) => {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (isActive && ref.current !== null) {
      ref.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isActive]);

  return (
    <li key={suggestion} ref={ref} className="w-full overflow-hidden">
      <Button
        className="w-full cursor-pointer justify-start overflow-hidden"
        size="xsmall"
        variant={isActive ? 'primary' : 'tertiary-neutral'}
        onMouseDown={() => onSelect(suggestion)}
      >
        <span className="block w-full truncate text-left font-normal">{suggestion}</span>
      </Button>
    </li>
  );
};
