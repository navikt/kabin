import { CogRotationIcon, LeaveIcon } from '@navikt/aksel-icons';
import { CopyButton, Dropdown } from '@navikt/ds-react';
import { css, styled } from 'styled-components';
import { ENVIRONMENT } from '@app/environment';

export const UserDropdown = (): JSX.Element | null => {
  const { version } = ENVIRONMENT;

  return (
    <Menu>
      <Dropdown.Menu.List>
        <Dropdown.Menu.List.Item as={StyledLogoutLink} href="/oauth2/logout" data-testid="logout-link">
          <LeaveIcon aria-hidden /> Logg ut
        </Dropdown.Menu.List.Item>
        <Dropdown.Menu.List.Item
          as={StyledCopyButton}
          title="Klikk for å kopiere versjonsnummeret"
          copyText={version}
          icon={<CogRotationIcon aria-hidden />}
          text={`Kabin-versjon: ${getShortVersion(version)}`}
        >{`Kabin-versjon: ${getShortVersion(version)}`}</Dropdown.Menu.List.Item>
      </Dropdown.Menu.List>
    </Menu>
  );
};

const Menu = styled(Dropdown.Menu)`
  overflow: visible;
  width: auto;
  max-width: 300px;

  & .navds-body-short {
    font-size: 16px;
  }
`;

const linkStyle = css`
  display: flex;
  gap: 8px;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  background: transparent;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
  padding-bottom: 12px;
`;

const StyledLink = styled.a`
  ${linkStyle}
`;

const StyledLogoutLink = styled(StyledLink)`
  color: #c30000;
`;

const StyledCopyButton = styled(CopyButton)`
  ${linkStyle}
  white-space: nowrap;

  .navds-copybutton__icon {
    margin-left: 0;
    width: 16px;
  }

  .navds-copybutton__content {
    gap: 8px;
  }
`;

const getShortVersion = (version: string): string => {
  if (version.length <= 7) {
    return version;
  }

  return version.substring(0, 7) + '...';
};
