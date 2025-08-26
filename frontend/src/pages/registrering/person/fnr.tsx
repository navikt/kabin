import { HStack, Search } from '@navikt/ds-react';
import { idnr } from '@navikt/fnrvalidator';
import { useState } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onFnrChange: (value: string | null) => void;
  onInputError: (error: string | null) => void;
  placeholder: string;
  ref?: React.Ref<HTMLDivElement>;
  key?: string;
}

export const FnrInput = ({ value, onChange, onFnrChange, onInputError, placeholder, ref, key }: Props) => {
  const [inputError, setInputError] = useState<string | undefined>(undefined);

  return (
    <HStack ref={ref} key={key} width="250px">
      <Search
        value={value}
        onChange={(raw) => {
          onChange(raw);

          const cleaned = raw.replaceAll(/\s/g, '');

          if (cleaned.length === 0) {
            onInputError(null);
            setInputError(undefined);
            onFnrChange(null);
          } else if (idnr(cleaned).status === 'valid') {
            onInputError(null);
            setInputError(undefined);
            onFnrChange(cleaned);
          } else {
            onInputError('Ugyldig fødselsnummer');
            setInputError('Ugyldig fødselsnummer');
            onFnrChange(null);
          }
        }}
        aria-errormessage={inputError}
        label={placeholder}
        placeholder={placeholder}
        hideLabel
        onKeyDown={({ key }) => {
          if (key === 'Escape') {
            onChange('');
            onFnrChange(null);
            return;
          }
        }}
        onFocus={(e) => e.target.select()}
        variant="simple"
        size="small"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        autoSave="off"
        id="sakengjelder"
      />
    </HStack>
  );
};
