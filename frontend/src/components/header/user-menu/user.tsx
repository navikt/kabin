import { Dropdown, InternalHeader } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { UserDropdown } from './dropdown';

export const User = () => {
  const { user } = useContext(StaticDataContext);

  return (
    <Dropdown>
      <InternalHeader.UserButton
        as={StyledToggle}
        data-testid="user-menu-button"
        name={user.navn}
        description={`Enhet: ${user.ansattEnhet.navn}`}
      />
      <UserDropdown />
    </Dropdown>
  );
};

const StyledToggle = styled(Dropdown.Toggle)`
  white-space: nowrap;
`;
