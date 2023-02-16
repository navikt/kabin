import { Header } from '@navikt/ds-react-internal';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { VersionCheckerStatus } from '../version-checker/version-checker-status';
import { User } from './user-menu/user';

export const NavHeader = () => (
  <Header>
    <Header.Title as={NavLink} to="/">
      Kabin
    </Header.Title>
    <MainArea>
      <VersionCheckerStatus />
    </MainArea>
    <User />
  </Header>
);

const MainArea = styled(Header.Title)`
  flex-grow: 1;
  justify-content: center;
`;
