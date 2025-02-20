import { useRegistrering } from '@app/hooks/use-registrering';
import { useSetSvarbrevInitialCustomTextMutation } from '@app/redux/api/svarbrev/svarbrev';
import { TextField } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

export const InitialFritekst = () => {
  const { id, svarbrev } = useRegistrering();
  const [value, setValue] = useState<string>(svarbrev.initialCustomText ?? '');
  const [setInitialCustomText] = useSetSvarbrevInitialCustomTextMutation();

  useEffect(() => {
    if (value === (svarbrev.initialCustomText ?? '')) {
      return;
    }

    const timer = setTimeout(() => {
      setInitialCustomText({ id, initialCustomText: value });
    }, 500);

    return () => clearTimeout(timer);
  }, [id, setInitialCustomText, svarbrev.initialCustomText, value]);

  return (
    <TextField
      size="small"
      label="Fritekst (valgfri)"
      value={value}
      onChange={({ target }) => setValue(target.value)}
    />
  );
};
