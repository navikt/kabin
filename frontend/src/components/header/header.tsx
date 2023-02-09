import { Header } from '@navikt/ds-react-internal';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { VersionCheckerStatus } from '../version-checker/version-checker-status';
import { User } from './user-menu/user';

export const NavHeader = () => (
  <Header>
    <Header.Title as={NavLink} to="/">
      Kabin
    </Header.Title>
    <VersionCheckerStatus />
    <User />
  </Header>
);
