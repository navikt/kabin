import { MulighetHeaders } from '@app/components/muligheter/common/table/headers';
import { MulighetRows } from '@app/components/muligheter/common/table/rows';
import type { MulighetMap, MulighetType } from '@app/components/muligheter/common/table/types';
import type { ValidationFieldNames } from '@app/types/validation';
import { Table } from '@navikt/ds-react';

type Props = {
  [T in MulighetType]: {
    fieldName: ValidationFieldNames;
    label: string;
    selectable: boolean;
    type: T;
    muligheter: MulighetMap[T][];
    columns: (keyof MulighetMap[T])[];
  };
}[MulighetType];

// The rest of `props` is spread as a whole to keep `type`, `muligheter` and `columns` correlated.
export const MuligheterTable = ({ fieldName, label, ...props }: Props) => (
  <div className="overflow-y-auto">
    <Table zebraStripes size="small" id={fieldName} aria-label={label}>
      <MulighetHeaders {...props} />
      <MulighetRows {...props} />
    </Table>
  </div>
);
