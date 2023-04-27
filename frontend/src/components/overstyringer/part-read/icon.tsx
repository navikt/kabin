import { Buldings2Icon, PersonIcon, QuestionmarkIcon } from '@navikt/aksel-icons';
import React from 'react';
import { AvsenderMottakerType, PartType } from '@app/types/common';

interface Props {
  type?: PartType | AvsenderMottakerType | null;
}

export const Icon = ({ type = null }: Props) => {
  if (type === PartType.ORGNR) {
    return <Buldings2Icon aria-hidden fontSize={20} />;
  }

  if (type === PartType.FNR) {
    return <PersonIcon aria-hidden fontSize={20} />;
  }

  return <QuestionmarkIcon aria-hidden fontSize={20} />;
};
