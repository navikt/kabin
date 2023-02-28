type OrgNum = [string, string, string, string, string, string, string, string, string];
type Foedselsnumer = [string, string, string, string, string, string, string, string, string, string, string];

const isOrgNum = (id: string[]): id is OrgNum => id.length === 9;
const isFoedselsnummer = (id: string[]): id is Foedselsnumer => id.length === 11;

const unsafeFormatOrgNum = ([a, b, c, d, e, f, g, h, i]: OrgNum): string => `${a}${b}${c} ${d}${e}${f} ${g}${h}${i}`;

export const formatOrgNum = (n: string): string => {
  const array = n.split('');

  if (isOrgNum(array)) {
    return unsafeFormatOrgNum(array);
  }

  return n;
};

const unsafeFormatFoedselsnummer = ([a, b, c, d, e, f, g, h, i, j, k]: Foedselsnumer) =>
  `${a}${b}${c}${d}${e}${f} ${g}${h}${i}${j}${k}`;

export const formatFoedselsnummer = (n: string | undefined | null): string => {
  if (n === null || typeof n === 'undefined') {
    return '';
  }

  const array = n.split('');

  if (isFoedselsnummer(array)) {
    return unsafeFormatFoedselsnummer(array);
  }

  return n;
};

export const formatId = (id: string): string => {
  if (id.length === 11) {
    return formatFoedselsnummer(id);
  }

  if (id.length === 9) {
    return formatOrgNum(id);
  }

  return id;
};
