import { useFieldName } from '@app/hooks/use-field-name';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetSaksnrITrMutation } from '@app/redux/api/registreringer/mutations';
import { ValidationFieldNames } from '@app/types/validation';
import { TextField } from '@navikt/ds-react';
import { useState } from 'react';

export const SaksnrITr = () => {
  const { trygderettenSaksnummer, id } = useRegistrering();
  const [setSaksnrITr] = useSetSaksnrITrMutation();
  const [value, setValue] = useState('');
  const error = useValidationError(ValidationFieldNames.TRYGDERETTEN_SAKSNUMMER);
  const fieldName = useFieldName(ValidationFieldNames.TRYGDERETTEN_SAKSNUMMER);

  return (
    <TextField
      size="small"
      label={fieldName}
      id={ValidationFieldNames.TRYGDERETTEN_SAKSNUMMER}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="shrink"
      onBlur={() => {
        if (trygderettenSaksnummer !== value) {
          setSaksnrITr({ id, trygderettenSaksnummer: value });
        }
      }}
      error={error}
    />
  );
};
