import { ReadOnlyText } from '@app/components/read-only-info/read-only-info';
import { defaultString } from '@app/functions/empty-string';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { DEFAULT_SVARBREV_NAME, useSetSvarbrevTitleMutation } from '@app/redux/api/svarbrev/svarbrev';
import { TextField } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

const ID = 'svarbrev-dokumentnavn';
const LABEL = 'Dokumentnavn';

export const SetTitle = () => {
  const { id, svarbrev } = useRegistrering();
  const [localTitle, setLocalTitle] = useState(svarbrev.title);
  const [setTitle] = useSetSvarbrevTitleMutation();
  const canEdit = useCanEdit();

  useEffect(() => {
    if (svarbrev.title === localTitle) {
      return;
    }

    const timeout = setTimeout(() => {
      setTitle({ id, title: localTitle });
    }, 500);

    return () => clearTimeout(timeout);
  }, [id, localTitle, setTitle, svarbrev.title]);

  if (!canEdit) {
    return <ReadOnlyText label={LABEL} value={svarbrev.title} id={ID} />;
  }

  return (
    <TextField
      className="w-full [&>input]:w-full"
      label={LABEL}
      id={ID}
      htmlSize={45}
      size="small"
      placeholder={DEFAULT_SVARBREV_NAME}
      value={localTitle}
      onBlur={({ target }) => setLocalTitle(defaultString(target.value, DEFAULT_SVARBREV_NAME))}
      onChange={({ target }) => setLocalTitle(target.value)}
    />
  );
};
