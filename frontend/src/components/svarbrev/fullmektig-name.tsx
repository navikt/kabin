import { TextField } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { ReadOnlyText } from '@app/components/read-only-info/read-only-info';
import { defaultString } from '@app/functions/empty-string';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useSetSvarbrevFullmektigFritekstMutation } from '@app/redux/api/svarbrev/svarbrev';

const ID = 'svarbrev-fullmektig-name';
const LABEL = 'Navn på fullmektig i brevet';

export const SetFullmektig = () => {
  const { id, overstyringer, svarbrev } = useRegistrering();
  const { fullmektig } = overstyringer;
  const [localName, setLocalName] = useState(svarbrev.fullmektigFritekst ?? fullmektig?.name ?? '');
  const [setName] = useSetSvarbrevFullmektigFritekstMutation();
  const canEdit = useCanEdit();

  if (!canEdit) {
    return <ReadOnlyText label={LABEL} value={svarbrev.fullmektigFritekst} id={ID} />;
  }

  useEffect(() => {
    if (svarbrev.fullmektigFritekst === localName) {
      return;
    }

    const timeout = setTimeout(() => {
      setName({ id, fullmektigFritekst: localName });
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [id, localName, setName, svarbrev.fullmektigFritekst, svarbrev.title]);

  return (
    <StyledTextField
      label={LABEL}
      id={ID}
      htmlSize={45}
      size="small"
      placeholder={fullmektig?.name ?? undefined}
      value={localName}
      onBlur={({ target }) => setLocalName(defaultString(target.value, fullmektig?.name ?? null) ?? '')}
      onChange={({ target }) => setLocalName(target.value)}
      autoComplete="off"
    />
  );
};

const StyledTextField = styled(TextField)`
  width: 100%;

  && > input {
    width: 100%;
  }
`;
