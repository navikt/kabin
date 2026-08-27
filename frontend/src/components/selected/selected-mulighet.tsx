import { Card } from '@app/components/card/card';
import { MuligheterTable } from '@app/components/muligheter/common/table/table';
import type { MulighetMap, MulighetType } from '@app/components/muligheter/common/table/types';
import { ValidationFieldNames } from '@app/types/validation';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { Button, Heading, HStack } from '@navikt/ds-react';

interface CommonProps {
  tableLabel: string;
}

interface NonTableProps {
  onClick: () => void;
  buttonLabel: string;
}

/** Correlates `type`, `muligheter` and `columns`, so that narrowing `type` narrows the other two. */
type MulighetProps = {
  [T in MulighetType]: {
    muligheter: MulighetMap[T][];
    type: T;
    columns: (keyof MulighetMap[T])[];
  };
}[MulighetType];

type BodyProps = MulighetProps & CommonProps;
type Props = MulighetProps & NonTableProps & CommonProps;

// The rest of `props` is spread as a whole to keep `type`, `muligheter` and `columns` correlated.
export const SelectedMulighet = ({ onClick, buttonLabel, ...props }: Props) => (
  <Card>
    <Header>
      <Heading size="small" level="1">
        Valgt vedtak
      </Heading>
      <Button
        data-color="neutral"
        size="small"
        title={buttonLabel}
        onClick={onClick}
        icon={<ChevronDownIcon aria-hidden />}
        variant="tertiary"
      />
    </Header>

    <SelectedMulighetBody {...props} />
  </Card>
);

export const SelectedMulighetBody = ({ tableLabel, ...props }: BodyProps) => (
  <MuligheterTable {...props} fieldName={ValidationFieldNames.MULIGHET} label={tableLabel} selectable={false} />
);

interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
}

const Header = ({ className = '', children }: HeaderProps) => (
  <HStack justify="space-between" className={className}>
    {children}
  </HStack>
);
