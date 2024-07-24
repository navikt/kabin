import { InternalHeader } from '@navikt/ds-react';
import { NavLink } from 'react-router-dom';
import { User } from './user-menu/user';

export const NavHeader = () => (
  <InternalHeader>
    <InternalHeader.Title as={NavLink} to="/">
      Kabin
    </InternalHeader.Title>
    <User />
  </InternalHeader>
);
