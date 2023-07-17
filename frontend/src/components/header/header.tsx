import { InternalHeader } from '@navikt/ds-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { styled } from 'styled-components';
import { VersionCheckerStatus } from '@app/components/version-checker/version-checker-status';
import { User } from './user-menu/user';

export const NavHeader = () => (
  <InternalHeader>
    <InternalHeader.Title as={NavLink} to="/">
      Kabin
    </InternalHeader.Title>
    <MainArea>
      <VersionCheckerStatus />
    </MainArea>
    <User />
  </InternalHeader>
);

const MainArea = styled(InternalHeader.Title)`
  flex-grow: 1;
  justify-content: center;
`;
