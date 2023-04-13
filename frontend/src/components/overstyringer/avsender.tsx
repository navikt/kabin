import React, { useContext, useState } from 'react';
import { AvsenderRead } from '@app/components/overstyringer/avsender-read';
import { AvsenderWrite } from '@app/components/overstyringer/avsender-write';
import { StyledAvsenderIcon } from '@app/components/overstyringer/icons';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';

export const Avsender = () => {
  const { journalpost, payload, type } = useContext(ApiContext);
  const [isEditMode, setIsEditMode] = useState(false);

  if (journalpost === null || type === Type.NONE) {
    return null;
  }

  if (isEditMode) {
    return <AvsenderWrite label="Avsender" exitEditMode={() => setIsEditMode(false)} icon={<StyledAvsenderIcon />} />;
  }

  return (
    <AvsenderRead
      label="Avsender"
      avsender={journalpost.avsenderMottaker ?? payload.overstyringer.avsender}
      enterEditMode={journalpost.avsenderMottaker === null ? () => setIsEditMode(true) : undefined}
      icon={<StyledAvsenderIcon />}
    />
  );
};
