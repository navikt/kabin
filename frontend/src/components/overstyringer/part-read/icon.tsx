import { Buldings2Icon, PersonCrossIcon, PersonIcon } from '@navikt/aksel-icons';
import React from 'react';
import { AvsenderMottakerType, PartType } from '@app/types/common';

interface Props {
  type?: PartType | AvsenderMottakerType | null;
}

export const Icon = ({ type = null }: Props) => {
  if (type === PartType.ORGNR) {
    return <Buldings2Icon aria-hidden />;
  }

  if (type === PartType.FNR) {
    return <PersonIcon aria-hidden />;
  }

  return <PersonCrossIcon aria-hidden />;
};
