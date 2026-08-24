import { MulighetHeaders } from '@app/components/muligheter/common/table/headers';
import { MulighetRows } from '@app/components/muligheter/common/table/rows';
import type { MulighetType } from '@app/components/muligheter/common/table/types';
import type { IBegjæringOmGjenopptakMulighet, IKlagemulighet, OtherMulighet } from '@app/types/mulighet';
import type { ValidationFieldNames } from '@app/types/validation';
import { Table } from '@navikt/ds-react';

interface CommonProps {
  fieldName: ValidationFieldNames;
  label: string;
}

interface OtherMulighetTableProps extends CommonProps {
  type: MulighetType.ADDITIONAL_KABAL_MULIGHET | MulighetType.ANKE | MulighetType.OMGJØRINGSKRAV;
  muligheter: OtherMulighet[];
  columns: (keyof OtherMulighet)[];
}

interface BegjæringOmGjenopptakMulighet extends CommonProps {
  type: MulighetType.BEGJÆRING_OM_GJENOPPTAK;
  muligheter: IBegjæringOmGjenopptakMulighet[];
  columns: (keyof IBegjæringOmGjenopptakMulighet)[];
}

interface Klagemulighet extends CommonProps {
  type: MulighetType.KLAGE;
  muligheter: IKlagemulighet[];
  columns: (keyof IKlagemulighet)[];
}

type Props = OtherMulighetTableProps | BegjæringOmGjenopptakMulighet | Klagemulighet;

export const MuligheterTable = ({ label, fieldName, ...props }: Props) => (
  <div className="overflow-y-auto">
    <Table zebraStripes size="small" id={fieldName} aria-label={label}>
      <MulighetHeaders {...props} />
      <MulighetRows {...props} />
    </Table>
  </div>
);
