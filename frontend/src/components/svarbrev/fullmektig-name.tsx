import { ReadOnlyText } from '@app/components/read-only-info/read-only-info';
import { defaultString } from '@app/functions/empty-string';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useSetSvarbrevFullmektigFritekstMutation } from '@app/redux/api/svarbrev/svarbrev';
import { TextField } from '@navikt/ds-react';
import { useCallback, useEffect, useState } from 'react';

const ID = 'svarbrev-fullmektig-name';
const LABEL = 'Navn på fullmektig i brevet';

export const SetFullmektig = () => {
  const { id, svarbrev } = useRegistrering();
  const [setFullmektigFritekst] = useSetSvarbrevFullmektigFritekstMutation();
  const canEdit = useCanEdit();

  const onChange = useCallback(
    (fullmektigFritekst: string) => setFullmektigFritekst({ id, fullmektigFritekst }),
    [id, setFullmektigFritekst],
  );

  if (!canEdit) {
    return <ReadOnlyText label={LABEL} value={svarbrev.fullmektigFritekst} id={ID} />;
  }

  return <DebouncedTextField onChange={onChange} />;
};

interface DebouncedTextFieldProps {
  onChange: (value: string) => void;
}

const DebouncedTextField = ({ onChange }: DebouncedTextFieldProps) => {
  const { overstyringer, svarbrev } = useRegistrering();
  const { fullmektig } = overstyringer;
  const defaultValue = fullmektig?.name ?? '';
  const [value, setValue] = useState(defaultString(svarbrev.fullmektigFritekst, fullmektig?.name ?? ''));

  useEffect(() => {
    if (value === (svarbrev.fullmektigFritekst ?? '')) {
      return;
    }

    const timeout = setTimeout(() => {
      onChange(value);
    }, 500);

    return () => clearTimeout(timeout);
  }, [onChange, svarbrev.fullmektigFritekst, value]);

  return (
    <TextField
      className="w-full [&>input]:w-full"
      label={LABEL}
      id={ID}
      htmlSize={45}
      size="small"
      placeholder={defaultValue}
      value={value}
      onBlur={({ target }) => setValue(defaultString(target.value, defaultValue))}
      onChange={({ target }) => setValue(target.value)}
      autoComplete="off"
    />
  );
};
