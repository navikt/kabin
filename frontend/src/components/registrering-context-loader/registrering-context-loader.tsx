import { LoadingRegistrering } from '@app/components/loading-registrering/loading-registrering';
import { LoadingStatus } from '@app/components/loading-status/loading-status';
import { RegistreringContext } from '@app/components/registrering-context-loader/registrering-context';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useGetRegistreringQuery } from '@app/redux/api/registreringer/queries';
import { VStack } from '@navikt/ds-react';
import { Navigate, Outlet, useLocation } from 'react-router';

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
