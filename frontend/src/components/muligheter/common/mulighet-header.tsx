import type { Mulighet } from '@app/redux/api/registreringer/types';
import { ArrowsCirclepathIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';

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
  <div className="grid grid-cols-[min-content_min-content_1fr] gap-1 whitespace-nowrap">
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
  </div>
);

export const HeaderReadOnly = () => (
  <div className="grid grid-cols-[min-content_min-content_1fr] gap-1 whitespace-nowrap">
    <Heading level="1" size="small">
      Vedtaket klagen gjelder
    </Heading>
  </div>
);
