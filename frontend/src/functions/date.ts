export const isDateAfter = (maybeAfter: string, base: string): boolean => base.localeCompare(maybeAfter) === -1;
