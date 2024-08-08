import { Loader } from '@navikt/ds-react';
import { createContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { styled } from 'styled-components';
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

  if (isLoading) {
    return (
      <LoaderWrapper>
        <Loader size="3xlarge" title="Laster registrering..." />;
      </LoaderWrapper>
    );
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

const LoaderWrapper = styled.div`
  display: flex;
  height: 100%;
`;
