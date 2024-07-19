import { Buldings2Icon, PersonIcon, QuestionmarkIcon } from '@navikt/aksel-icons';
import { AvsenderMottakerType, IdType } from '@app/types/common';

interface Props {
  type?: IdType | AvsenderMottakerType | null;
}

export const Icon = ({ type = null }: Props) => {
  if (type === IdType.ORGNR) {
    return <Buldings2Icon aria-hidden fontSize={20} />;
  }

  if (type === IdType.FNR) {
    return <PersonIcon aria-hidden fontSize={20} />;
  }

  return <QuestionmarkIcon aria-hidden fontSize={20} />;
};
