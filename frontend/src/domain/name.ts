import { INavn } from '@app/domain/types';
import { formatFoedselsnummer, formatOrgNum } from '@app/functions/format-id';
import { IPart } from '@app/types/common';

export const getFullName = (nameObject?: INavn | null): string => {
  if (nameObject === null || typeof nameObject === 'undefined') {
    return '-';
  }

  const { fornavn, mellomnavn, etternavn } = nameObject;
  const navnListe = [fornavn, mellomnavn, etternavn].filter((n) => typeof n === 'string' && n.length !== 0);

  if (navnListe.length === 0) {
    return '-';
  }

  return navnListe.join(' ');
};

export const getSakspartName = (sakspart: IPart | null, defaultValue: string | null = '-'): string | null => {
  if (sakspart === null) {
    return defaultValue;
  }
  const { person, virksomhet } = sakspart;

  if (person !== null) {
    return getFullName(person.navn);
  }

  if (virksomhet !== null) {
    return virksomhet.navn;
  }

  return null;
};

export const getSakspartId = (sakspart: IPart | null): string | null => {
  if (sakspart === null) {
    return null;
  }
  const { person, virksomhet } = sakspart;

  if (person !== null) {
    return formatFoedselsnummer(person.foedselsnummer);
  }

  if (virksomhet !== null) {
    return formatOrgNum(virksomhet.virksomhetsnummer);
  }

  return null;
};

export const getSakspartNameAndId = (sakspart: IPart | null): string | null => {
  const partName = getSakspartName(sakspart);
  const partId = getSakspartId(sakspart);

  if (partName === null || partId === null) {
    return null;
  }

  return `${partName} (${partId})`;
};
