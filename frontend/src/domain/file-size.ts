const KILOBYTE = 1_000;
const MEGABYTE = KILOBYTE * 1_000;
const GIGABYTE = MEGABYTE * 1_000;

/**
 * Dokarkiv uses 512 megabytes (10**6) in their NGINX proxy-body-size config.
 * @link https://github.com/navikt/dokarkiv/blob/master/nais/naiserator.yaml#L9
 */
export const MAX_TOTAL_SIZE_BYTES = 512 * MEGABYTE;

type FileSizeUnit = 'byte' | 'kilobyte' | 'megabyte' | 'gigabyte';

const FORMATTERS: Record<FileSizeUnit, Intl.NumberFormat> = {
  byte: new Intl.NumberFormat('nb-NO', { style: 'unit', unit: 'byte', maximumFractionDigits: 0 }),
  kilobyte: new Intl.NumberFormat('nb-NO', { style: 'unit', unit: 'kilobyte', maximumFractionDigits: 1 }),
  megabyte: new Intl.NumberFormat('nb-NO', { style: 'unit', unit: 'megabyte', maximumFractionDigits: 1 }),
  gigabyte: new Intl.NumberFormat('nb-NO', { style: 'unit', unit: 'gigabyte', maximumFractionDigits: 1 }),
};

export const formatFileSize = (bytes: number): string => {
  if (bytes >= GIGABYTE) {
    return FORMATTERS.gigabyte.format(bytes / GIGABYTE);
  }

  if (bytes >= MEGABYTE) {
    return FORMATTERS.megabyte.format(bytes / MEGABYTE);
  }

  if (bytes >= KILOBYTE) {
    return FORMATTERS.kilobyte.format(bytes / KILOBYTE);
  }

  return FORMATTERS.byte.format(bytes);
};
