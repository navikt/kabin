import { useContext } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { useRegistrering } from '@app/hooks/use-registrering';

export const useCanEdit = () => {
  const registrering = useRegistrering();
  const { user } = useContext(StaticDataContext);

  if (registrering.finished !== null) {
    return false;
  }

  return registrering.createdBy === user.navIdent;
};
