import { ArrowUndoIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';

interface Props {
  onDelete: () => void;
}

export const DeleteButton = ({ onDelete }: Props) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleConfirm = () => setShowConfirm(!showConfirm);

  if (showConfirm) {
    return (
      <>
        <Button variant="danger" icon={<TrashIcon aria-hidden />} onClick={onDelete} size="small" />
        <Button
          variant="secondary"
          icon={<ArrowUndoIcon aria-hidden />}
          onClick={() => setShowConfirm(false)}
          size="small"
        />
      </>
    );
  }

  return <Button variant="danger" icon={<TrashIcon aria-hidden />} onClick={toggleConfirm} size="small" />;
};
