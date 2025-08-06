import { StaticDataContext } from '@app/components/app/static-data-context';
import { UserDropdown } from '@app/components/header/user-menu/dropdown';
import { ActionMenu, InternalHeader } from '@navikt/ds-react';
import { useContext } from 'react';

export const User = () => {
  const { user } = useContext(StaticDataContext);

  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <InternalHeader.UserButton
          data-testid="user-menu-button"
          name={user.navn}
          description={`Enhet: ${user.ansattEnhet.navn}`}
        />
      </ActionMenu.Trigger>

      <UserDropdown />
    </ActionMenu>
  );
};
