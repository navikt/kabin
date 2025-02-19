import { useRegistrering } from '@app/hooks/use-registrering';
import { useSetSvarbrevExtraCustomTextMutation } from '@app/redux/api/svarbrev/svarbrev';
import { TextField } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

export const InitialFritekst = () => {
  const { id, svarbrev } = useRegistrering();
  const [value, setValue] = useState<string>(svarbrev.initialCustomText ?? '');
  const [setExtraCustomText] = useSetSvarbrevExtraCustomTextMutation();

  useEffect(() => {
    if (value === (svarbrev.initialCustomText ?? '')) {
      return;
    }

    const timer = setTimeout(() => {
      setExtraCustomText({ id, initialCustomText: value });
    }, 500);

    return () => clearTimeout(timer);
  }, [id, setExtraCustomText, svarbrev.initialCustomText, value]);

  return (
    <TextField size="small" label="Initiell fritekst" value={value} onChange={({ target }) => setValue(target.value)} />
  );
};
