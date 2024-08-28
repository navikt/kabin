import { StaticDataContext } from '@app/components/app/static-data-context';
import { UserDropdown } from '@app/components/header/user-menu/dropdown';
import { Dropdown, InternalHeader } from '@navikt/ds-react';
import { useContext } from 'react';
import { styled } from 'styled-components';

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
