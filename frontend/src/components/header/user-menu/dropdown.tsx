import { AppThemeSwitcher } from '@app/components/header/user-menu/app-theme';
import { useIsUpToDate } from '@app/components/version-checker/version-checker';
import { ENVIRONMENT } from '@app/environment';
import { pushEvent } from '@app/observability';
import { ArrowCirclepathIcon, BranchingIcon, CheckmarkCircleIcon, LeaveIcon } from '@navikt/aksel-icons';
import { ActionMenu, Tooltip } from '@navikt/ds-react';

export const UserDropdown = (): React.JSX.Element | null => {
  const { version } = ENVIRONMENT;
  const isUpToDate = useIsUpToDate();

  return (
    <ActionMenu.Content className="w-auto max-w-75 overflow-visible">
      <ActionMenu.Group label="Tema">
        <ActionMenu.Item as={AppThemeSwitcher} />
      </ActionMenu.Group>

      <ActionMenu.Divider />

      <ActionMenu.Group label="Bruker">
        <ActionMenu.Item
          as="a"
          href="/oauth2/logout"
          data-testid="logout-link"
          onClick={() => pushEvent('logout', 'user-menu')}
          className="cursor-pointer text-ax-text-danger"
          variant="danger"
          icon={<LeaveIcon />}
        >
          Logg ut
        </ActionMenu.Item>
      </ActionMenu.Group>

      <ActionMenu.Divider />

      <ActionMenu.Group label="System">
        <Tooltip content={isUpToDate ? 'Du bruker siste versjon av Kabin' : 'Laster Kabin på nytt'} placement="left">
          <ActionMenu.Item
            icon={isUpToDate ? <CheckmarkCircleIcon aria-hidden /> : <ArrowCirclepathIcon aria-hidden />}
            className="cursor-pointer"
            onSelect={isUpToDate ? undefined : () => window.location.reload()}
          >
            {isUpToDate ? 'Kabin er oppdatert' : 'Oppdater Kabin'}
          </ActionMenu.Item>
        </Tooltip>

        <Tooltip content="Kopierer versjonsnummeret til versjonen du bruker nå" placement="left">
          <ActionMenu.Item
            title="Klikk for å kopiere versjonsnummeret"
            icon={<BranchingIcon aria-hidden />}
            onSelect={() => navigator.clipboard.writeText(version)}
            className="cursor-pointer"
          >
            Kabin-versjon: {version}
          </ActionMenu.Item>
        </Tooltip>
      </ActionMenu.Group>
    </ActionMenu.Content>
  );
};
