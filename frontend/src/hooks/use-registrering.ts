import { useContext } from 'react';
import { RegistreringContext } from '@app/pages/create/registrering-context';

export const useRegistrering = () => {
  const registrering = useContext(RegistreringContext);

  if (registrering === undefined) {
    throw new Error('useRegistrering must be used within RegistreringContext');
  }

  return registrering;
};
