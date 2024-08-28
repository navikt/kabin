import { User } from '@app/components/header/user-menu/user';
import { InternalHeader } from '@navikt/ds-react';
import { NavLink } from 'react-router-dom';

export const NavHeader = () => (
  <InternalHeader>
    <InternalHeader.Title as={NavLink} to="/">
      Kabin
    </InternalHeader.Title>
    <div style={{ flexGrow: 1 }} aria-hidden role="presentation" />
    <User />
  </InternalHeader>
);
