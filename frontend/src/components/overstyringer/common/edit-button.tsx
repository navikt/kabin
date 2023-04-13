import { PencilIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';

interface EditButtonProps {
  enterEditMode?: () => void;
}

export const EditButton = ({ enterEditMode }: EditButtonProps) => {
  if (enterEditMode === undefined) {
    return null;
  }

  return (
    <Button size="small" variant="secondary" icon={<PencilIcon />} title="Endre" onClick={enterEditMode}>
      Endre
    </Button>
  );
};
