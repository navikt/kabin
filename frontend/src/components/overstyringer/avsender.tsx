import React, { useContext } from 'react';
import { FullmektigIcon, KlagerIcon, SakenGjelderIcon, StyledAvsenderIcon } from '@app/components/overstyringer/icons';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { JournalposttypeEnum } from '@app/types/dokument';
import { ValidationFieldNames } from '@app/types/validation';
import { Part } from './part';
import { FieldNames } from './types';

export const Avsender = () => {
  const { type, payload, journalpost } = useContext(ApiContext);
  const error = useValidationError(ValidationFieldNames.AVSENDER);

  if (type === Type.NONE || payload.mulighet === null) {
    return null;
  }

  const { overstyringer, mulighet } = payload;

  if (journalpost === null || journalpost.journalposttype !== JournalposttypeEnum.INNGAAENDE) {
    return null;
  }

  return (
    <Part
      partField={FieldNames.AVSENDER}
      part={overstyringer.avsender}
      label="Avsender"
      icon={<StyledAvsenderIcon aria-hidden />}
      error={error}
      options={[
        {
          label: 'Saken gjelder',
          defaultPart: mulighet.sakenGjelder,
          title: 'Saken gjelder',
          icon: <SakenGjelderIcon aria-hidden />,
        },
        {
          label: getKlagerLabel(type),
          defaultPart: overstyringer.klager,
          title: getKlagerLabel(type),
          icon: <KlagerIcon aria-hidden />,
        },
        {
          label: 'Fullmektig',
          defaultPart: overstyringer.fullmektig,
          title: 'Fullmektig',
          icon: <FullmektigIcon aria-hidden />,
        },
      ]}
    />
  );
};

const getKlagerLabel = (type: Type.ANKE | Type.KLAGE) => {
  switch (type) {
    case Type.ANKE:
      return 'Ankende part';
    case Type.KLAGE:
      return 'Klager';
  }
};
