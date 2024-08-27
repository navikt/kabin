import { createContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { styled } from 'styled-components';
import { LoadingRegistrering } from '@app/components/loading-registrering/loading-registrering';
import { LoadingStatus } from '@app/components/loading-status/loading-status';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useGetRegistreringQuery } from '@app/redux/api/registreringer/queries';
import { Registrering } from '@app/redux/api/registreringer/types';

export const RegistreringContext = createContext<Registrering>({} as Registrering);

export const RegistreringContextLoader = () => (
  <PageWrapper>
    <RegistreringLoader>
      <Outlet />
    </RegistreringLoader>
  </PageWrapper>
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

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  width: 100%;
  overflow: auto;
`;
