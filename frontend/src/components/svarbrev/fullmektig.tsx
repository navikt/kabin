import { TextField } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';

interface Props {
  fullmektig: string;
  onChange: (v: string) => void;
}

export const Fullmektig = ({ fullmektig, onChange }: Props) => {
  const [value, setValue] = useState<string>(fullmektig);

  useEffect(() => {
    const timeout = setTimeout(() => onChange(value), 500);

    return () => clearTimeout(timeout);
  }, [value, onChange]);

  return (
    <TextField
      label="Navn på fullmektig i brevet"
      value={value}
      onChange={({ target }) => setValue(target.value)}
      size="small"
    />
  );
};
