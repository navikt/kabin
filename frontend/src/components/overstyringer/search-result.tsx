import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps, Loader, Tag, TagProps, Tooltip } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { getSakspartName } from '../../domain/name';
import { formatId } from '../../functions/format-id';
import { IPart } from '../../types/common';

interface Props {
  label: string;
  data: IPart | undefined;
  setPart: (part: IPart) => void;
  isLoading: boolean;
  dismiss: () => void;
  searchString: string;
  isValid: boolean;
}

export const SearchResult = ({ setPart, dismiss, data, isLoading, searchString, isValid }: Props) => {
  if (isLoading) {
    return (
      <Render variant="alt3" onDismiss={dismiss}>
        <Loader size="medium" /> Søker...
      </Render>
    );
  }

  if (typeof data !== 'undefined' && (data.person !== null || data.virksomhet !== null)) {
    return (
      <Render variant="alt3" onConfirm={() => setPart(data)} onDismiss={dismiss}>
        {getSakspartName(data)}
      </Render>
    );
  }

  if (searchString.length === 0) {
    return (
      <Render variant="alt3" onDismiss={dismiss}>
        Søk etter person eller virksomhet
      </Render>
    );
  }

  if (!isValid) {
    return (
      <Render variant="warning" onDismiss={dismiss}>
        Ugyldig ID-nummer
      </Render>
    );
  }

  return (
    <Render variant="warning" onDismiss={dismiss}>
      Ingen treff på &quot;{formatId(searchString)}&quot;
    </Render>
  );
};

interface RenderProps {
  variant: TagProps['variant'];
  children: React.ReactNode;
  onConfirm?: () => void;
  onDismiss?: () => void;
}

const Render = ({ children, variant, onConfirm, onDismiss }: RenderProps) => {
  const accept =
    onConfirm === undefined ? null : (
      <CustomButton
        onClick={onConfirm}
        icon={<CheckmarkIcon aria-hidden />}
        label="Bruk"
        keys={['enter']}
        variant="primary"
      />
    );

  const dismiss =
    onDismiss === undefined ? null : (
      <CustomButton
        onClick={onDismiss}
        icon={<XMarkIcon aria-hidden />}
        label="Avbryt"
        keys={['esc']}
        variant="secondary"
      />
    );

  return (
    <StyledSearchResults>
      <StyledTag variant={variant} size="medium">
        {children}
      </StyledTag>
      <Buttons>
        {accept}
        {dismiss}
      </Buttons>
    </StyledSearchResults>
  );
};

interface CustomButtonProps {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  keys: string[];
  variant?: ButtonProps['variant'];
}

const CustomButton = ({ label, icon, keys, onClick, variant }: CustomButtonProps) => (
  <Tooltip content={label} keys={keys}>
    <Button size="small" variant={variant} onClick={onClick} icon={icon} title={label}>
      {label}
    </Button>
  </Tooltip>
);

const StyledSearchResults = styled.div`
  grid-area: results;
  display: flex;
  flex-direction: column;
  align-items: left;
  gap: 8px;
`;

const StyledTag = styled(Tag)`
  display: flex;
  flex-direction: row;
  column-gap: 8px;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  column-gap: 8px;
`;
