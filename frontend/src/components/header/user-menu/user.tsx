import { Dropdown, Header } from '@navikt/ds-react-internal';
import React from 'react';
import styled from 'styled-components';
import { UserDropdown } from './dropdown';

export const User = () => (
  <Dropdown>
    <Header.UserButton as={StyledToggle} data-testid="user-menu-button" name="Ukjent" />
    <UserDropdown />
  </Dropdown>
);

const StyledToggle = styled(Dropdown.Toggle)`
  white-space: nowrap;
`;
