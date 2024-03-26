export const defaultString = <F extends string | null>(main: string | null, fallback: F): F | string => {
  if (main === null) {
    return fallback;
  }

  const trimmed = main.trim();

  if (trimmed.length === 0) {
    return fallback;
  }

  return trimmed;
};
