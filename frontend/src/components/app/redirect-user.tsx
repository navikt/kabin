import { Loader } from '@navikt/ds-react';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { useUser } from '@app/simple-api-state/use-api';
import { Role } from '@app/types/bruker';

export const RedirectUser = () => {
  const { data, isLoading } = useUser();

  if (isLoading || typeof data === 'undefined') {
    return (
      <StyledMain>
        <Loader size="3xlarge"></Loader>
      </StyledMain>
    );
  }

  if (data.roller.includes(Role.ROLE_KLAGE_OPPGAVESTYRING_ALLE_ENHETER)) {
    return <Navigate to="/opprett" />;
  }

  if (data.roller.includes(Role.ROLE_ADMIN)) {
    return <Navigate to="/admin" />;
  }

  return null;
};

const StyledMain = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  overflow-y: hidden;
  overflow-x: hidden;
`;
