import { Skeleton } from '@navikt/ds-react';
import { createContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { Registrering, useGetRegistreringQuery } from '@app/redux/api/registrering';

export const RegistreringContext = createContext<Registrering>({} as Registrering);

interface Props {
  children: React.ReactNode;
}

export const RegistreringLoader = ({ children }: Props) => {
  const registreringId = useRegistreringId();
  const { data, isLoading, isSuccess } = useGetRegistreringQuery(registreringId);

  if (isLoading) {
    return (
      <>
        <Skeleton variant="rounded" height={32} width={300} />
        <Skeleton variant="rounded" height={32} width={65} />
      </>
    );
  }

  if (!isSuccess) {
    return <Navigate to="/" replace />;
  }

  return <RegistreringContext.Provider value={data}>{children}</RegistreringContext.Provider>;
};
