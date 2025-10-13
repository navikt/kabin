import type { Mulighet } from '@app/redux/api/registreringer/types';
import { ArrowsCirclepathIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  toggleExpanded: () => void;
  refetch: (id: string) => void;
  isFetching: boolean;
  mulighet: Mulighet | undefined;
  id: string;
  showOnlySelectedLabel: string;
  label: string;
}

export const HeaderEditable = ({
  toggleExpanded,
  refetch,
  isFetching,
  mulighet,
  id,
  showOnlySelectedLabel,
  label,
}: Props) => (
  <Header>
    <Heading level="1" size="small">
      {label}
    </Heading>

    <Button
      size="xsmall"
      variant="tertiary-neutral"
      onClick={() => refetch(id)}
      loading={isFetching}
      icon={<ArrowsCirclepathIcon aria-hidden />}
      title="Oppdater"
    />

    {mulighet === undefined ? null : (
      <StyledButton
        size="small"
        variant="tertiary-neutral"
        title={showOnlySelectedLabel}
        onClick={toggleExpanded}
        icon={<ChevronUpIcon aria-hidden />}
      />
    )}
  </Header>
);

export const HeaderReadOnly = () => (
  <Header>
    <Heading level="1" size="small">
      Vedtaket klagen gjelder
    </Heading>
  </Header>
);

export const Header = styled.div`
  display: grid;
  grid-template-columns: min-content min-content 1fr;
  grid-gap: 4px;
  white-space: nowrap;
`;

const StyledButton = styled(Button)`
  flex-grow: 0;
  width: fit-content;
  align-self: flex-end;
  justify-self: right;
`;
