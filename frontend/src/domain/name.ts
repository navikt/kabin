import { formatFoedselsnummer, formatOrgNum } from '@app/functions/format-id';
import { type IAvsenderMottaker, type IPart, type ISimplePart, IdType } from '@app/types/common';

export const getSakspartName = (
  sakspart: IPart | ISimplePart | IAvsenderMottaker | undefined | null,
  defaultValue: string | undefined | null = '-',
): string | null => (sakspart === undefined || sakspart === null ? defaultValue : sakspart.name);

const getSakspartId = (sakspart: IPart | ISimplePart | undefined | null): string | null => {
  if (sakspart === undefined || sakspart === null) {
    return null;
  }

  if (sakspart.type === IdType.FNR) {
    return formatFoedselsnummer(sakspart.identifikator);
  }

  if (sakspart.type === IdType.ORGNR) {
    return formatOrgNum(sakspart.identifikator);
  }

  return null;
};

export const getSakspartNameAndId = (sakspart: IPart | ISimplePart | undefined | null): string | null => {
  const partName = getSakspartName(sakspart);
  const partId = getSakspartId(sakspart);

  if (partName === null || partId === null) {
    return null;
  }

  return `${partName} (${partId})`;
};
