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
  // `currentData` is only defined for the current `registreringId`, unlike `data`, which keeps the previous registrering while the next one is fetched.
  const { currentData, isError } = useGetRegistreringQuery(registreringId);
  const location = useLocation();

  if (isError) {
    return <Navigate to="/" replace />;
  }

  if (currentData === undefined) {
    if (location.pathname.endsWith('/status')) {
      return <LoadingStatus />;
    }

    return <LoadingRegistrering />;
  }

  // Remount on registrering change, so no local state from the previous registrering is carried over.
  return (
    <RegistreringContext.Provider key={currentData.id} value={currentData}>
      {children}
    </RegistreringContext.Provider>
  );
};
