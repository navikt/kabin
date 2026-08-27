import { Card } from '@app/components/card/card';
import { MuligheterTable } from '@app/components/muligheter/common/table/table';
import type { MulighetType, OtherMulighetType } from '@app/components/muligheter/common/table/types';
import type { IKlagemulighet, OtherMulighet } from '@app/types/mulighet';
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

interface Other {
  muligheter: OtherMulighet[];
  type: OtherMulighetType;
  columns: (keyof OtherMulighet)[];
}

interface Klage {
  muligheter: IKlagemulighet[];
  type: MulighetType.KLAGE;
  columns: (keyof IKlagemulighet)[];
}

type MulighetProps = Other | Klage;
type BodyProps = MulighetProps & CommonProps;
type Props = MulighetProps & NonTableProps & CommonProps;

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
