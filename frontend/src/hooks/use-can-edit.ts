import { StaticDataContext } from '@app/components/app/static-data-context';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useContext } from 'react';

export const useIsOwner = () => {
  const { createdBy } = useRegistrering();
  const { user } = useContext(StaticDataContext);

  return createdBy === user.navIdent;
};

export const useCanEdit = () => {
  const { finished, createdBy } = useRegistrering();
  const { user } = useContext(StaticDataContext);

  if (finished !== null) {
    return false;
  }

  return createdBy === user.navIdent;
};
