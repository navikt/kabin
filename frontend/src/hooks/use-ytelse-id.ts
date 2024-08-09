import { useRegistrering } from '@app/hooks/use-registrering';

export const useYtelseId = (): string | null => {
  const { overstyringer } = useRegistrering();

  return overstyringer.ytelseId;
};
