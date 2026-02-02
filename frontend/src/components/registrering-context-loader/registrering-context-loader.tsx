import { LoadingRegistrering } from '@app/components/loading-registrering/loading-registrering';
import { LoadingStatus } from '@app/components/loading-status/loading-status';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useGetRegistreringQuery } from '@app/redux/api/registreringer/queries';
import type { Registrering } from '@app/redux/api/registreringer/types';
import { VStack } from '@navikt/ds-react';
import { createContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const RegistreringContext = createContext<Registrering>({} as Registrering);

export const RegistreringContextLoader = () => (
  <VStack width="100%" flexGrow="1" align="center" overflow="auto">
    <RegistreringLoader>
      <Outlet />
    </RegistreringLoader>
  </VStack>
);

interface Props {
  children: React.ReactNode;
}

const RegistreringLoader = ({ children }: Props) => {
  const registreringId = useRegistreringId();
  const { data, isLoading, isSuccess } = useGetRegistreringQuery(registreringId);
  const location = useLocation();

  if (isLoading) {
    if (location.pathname.endsWith('/status')) {
      return <LoadingStatus />;
    }

    return <LoadingRegistrering />;
  }

  if (!isSuccess) {
    return <Navigate to="/" replace />;
  }

  return <RegistreringContext.Provider value={data}>{children}</RegistreringContext.Provider>;
};
