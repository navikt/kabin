import type { Mulighet } from '@app/redux/api/registreringer/types';
import { ArrowsCirclepathIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, Heading, HStack } from '@navikt/ds-react';

interface Props {
  toggleExpanded: () => void;
  refetch: (id: string) => void;
  isFetching: boolean;
  mulighet: Mulighet | undefined;
  id: string;
  showOnlySelectedLabel: string;
  label: string;
  children?: React.ReactNode;
}

export const HeaderEditable = ({
  toggleExpanded,
  refetch,
  isFetching,
  mulighet,
  id,
  showOnlySelectedLabel,
  label,
  children,
}: Props) => (
  <HStack justify="space-between">
    <HStack align="center" gap="space-4">
      <Heading level="1" size="small">
        {label}
      </Heading>

      <Button
        data-color="neutral"
        size="xsmall"
        variant="tertiary"
        onClick={() => refetch(id)}
        loading={isFetching}
        icon={<ArrowsCirclepathIcon aria-hidden />}
        title="Oppdater"
      />

      {children}
    </HStack>

    {mulighet === undefined ? null : (
      <Button
        className="w-fit grow-0 self-end justify-self-end"
        size="small"
        variant="tertiary-neutral"
        title={showOnlySelectedLabel}
        onClick={toggleExpanded}
        icon={<ChevronUpIcon aria-hidden />}
      />
    )}
  </HStack>
);
