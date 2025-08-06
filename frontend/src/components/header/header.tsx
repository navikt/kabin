import { User } from '@app/components/header/user-menu/user';
import { InternalHeader, Spacer } from '@navikt/ds-react';
import { NavLink } from 'react-router-dom';

export const NavHeader = () => (
  <InternalHeader>
    <InternalHeader.Title as={NavLink} to="/">
      Kabin
    </InternalHeader.Title>
    <Spacer />
    <User />
  </InternalHeader>
);
