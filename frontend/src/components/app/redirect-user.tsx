import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { Role } from '@app/types/bruker';

export const RedirectUser = () => {
  const { user } = useContext(StaticDataContext);

  if (user.roller.includes(Role.ROLE_KLAGE_OPPGAVESTYRING_ALLE_ENHETER)) {
    return <Navigate to="/opprett" />;
  }

  if (user.roller.includes(Role.ROLE_ADMIN)) {
    return <Navigate to="/admin" />;
  }

  return null;
};
