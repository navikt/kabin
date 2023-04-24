import React, { useContext } from 'react';
import { FullmektigIcon, KlagerIcon, SakenGjelderIcon, StyledAvsenderIcon } from '@app/components/overstyringer/icons';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { JournalposttypeEnum } from '@app/types/dokument';
import { Part } from './part';
import { FieldNames, GridArea } from './types';

export const Avsender = () => {
  const { type, payload, journalpost } = useContext(ApiContext);

  if (type === Type.NONE || payload.mulighet === null) {
    return null;
  }

  const { overstyringer, mulighet } = payload;

  if (journalpost !== null && journalpost.journalposttype === JournalposttypeEnum.NOTAT) {
    return null;
  }

  return (
    <Part
      gridArea={GridArea.AVSENDER}
      partField={FieldNames.AVSENDER}
      part={overstyringer.avsender}
      label="Avsender"
      icon={<StyledAvsenderIcon aria-hidden />}
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
