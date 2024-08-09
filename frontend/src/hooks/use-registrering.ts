import { useContext } from 'react';
import { RegistreringContext } from '@app/components/registrering-context-loader/registrering-context-loader';

export const useRegistrering = () => {
  const registrering = useContext(RegistreringContext);

  if (registrering === undefined) {
    throw new Error('useRegistrering must be used within RegistreringContext');
  }

  return registrering;
};
