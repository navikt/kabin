export const isNotNull = <T>(value: T | null): value is T => value !== null;
export const isNotNullNorUndefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;
