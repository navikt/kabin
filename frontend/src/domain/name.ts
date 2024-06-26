import { formatFoedselsnummer, formatOrgNum } from '@app/functions/format-id';
import { IAvsenderMottaker, IPart, ISimplePart, IdType } from '@app/types/common';

export const getSakspartName = (
  sakspart: IPart | ISimplePart | IAvsenderMottaker | null,
  defaultValue: string | null = '-',
): string | null => (sakspart === null ? defaultValue : sakspart.name);

const getSakspartId = (sakspart: IPart | ISimplePart | null): string | null => {
  if (sakspart === null) {
    return null;
  }

  if (sakspart.type === IdType.FNR) {
    return formatFoedselsnummer(sakspart.id);
  }

  if (sakspart.type === IdType.ORGNR) {
    return formatOrgNum(sakspart.id);
  }

  return null;
};

export const getSakspartNameAndId = (sakspart: IPart | ISimplePart | null): string | null => {
  const partName = getSakspartName(sakspart);
  const partId = getSakspartId(sakspart);

  if (partName === null || partId === null) {
    return null;
  }

  return `${partName} (${partId})`;
};
