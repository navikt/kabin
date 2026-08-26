import { SelectMulighet } from '@app/components/muligheter/common/select-button';
import { Cell } from '@app/components/muligheter/common/table/cell';
import { MulighetType, type OtherMulighetType } from '@app/components/muligheter/common/table/types';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import {
  useSetAdditionalKabalMulighetMutation,
  useSetAnkemulighetMutation,
  useSetNonAnkemulighetMutation,
} from '@app/redux/api/registreringer/mutations';
import type { IBegjæringOmGjenopptakMulighet, IKlagemulighet, OtherMulighet } from '@app/types/mulighet';
import { Table } from '@navikt/ds-react';
import { type JSX, useCallback } from 'react';

interface CommonProps {
  isValid: boolean;
}

interface OtherRowsProps extends CommonProps {
  type: OtherMulighetType;
  mulighet: OtherMulighet;
  columns: (keyof OtherMulighet)[];
}

interface BegjæringOmGjenopptakMulighetRowsProps extends CommonProps {
  type: MulighetType.BEGJÆRING_OM_GJENOPPTAK;
  mulighet: IBegjæringOmGjenopptakMulighet;
  columns: (keyof IBegjæringOmGjenopptakMulighet)[];
}

interface KlagemulighetRowsProps extends CommonProps {
  type: MulighetType.KLAGE;
  mulighet: IKlagemulighet;
  columns: (keyof IKlagemulighet)[];
}

type Props = OtherRowsProps | BegjæringOmGjenopptakMulighetRowsProps | KlagemulighetRowsProps;

export const Row = (props: Props) => {
  const { mulighet, type, isValid } = props;
  const { mulighet: selectedMulighet } = useMulighet();
  const { id } = useRegistrering();
  const canEdit = useCanEdit();
  const [setAnkemulighet, { isLoading: isLoadingAnkemulighet }] = useSetAnkemulighetMutation();
  const [setNonAnkemulighet, { isLoading: isLoadingNonAnkemulighet }] = useSetNonAnkemulighetMutation();
  const [setAdditionalKabalMulighet, { isLoading: isLoadingAdditionalKabalMulighet }] =
    useSetAdditionalKabalMulighetMutation();

  const isSelected = selectedMulighet?.id === mulighet.id;

  const getCursorClass = () => (isValid && canEdit ? 'cursor-pointer' : 'cursor-default');
  const getBackgroundClass = () =>
    !isValid && isSelected ? 'bg-ax-bg-danger-soft hover:bg-ax-bg-danger-moderate-hover' : '';

  const isLoading = isLoadingAnkemulighet || isLoadingNonAnkemulighet || isLoadingAdditionalKabalMulighet;

  const selectMulighet = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isValid) {
        return;
      }

      if (selectedMulighet === null || selectedMulighet?.id !== mulighet.id) {
        switch (type) {
          case MulighetType.ANKE:
            setAnkemulighet({ id, mulighet });
            break;
          case MulighetType.ADDITIONAL_KABAL_MULIGHET:
            setAdditionalKabalMulighet({ id, mulighet });
            break;
          case MulighetType.OMGJØRINGSKRAV:
          case MulighetType.BEGJÆRING_OM_GJENOPPTAK:
          case MulighetType.KLAGE:
            setNonAnkemulighet({ id, mulighet });
            break;
        }
      }
    },
    [
      isValid,
      mulighet,
      id,
      selectedMulighet?.id,
      selectedMulighet,
      setAnkemulighet,
      setNonAnkemulighet,
      setAdditionalKabalMulighet,
      type,
    ],
  );

  return (
    <Table.Row className={`rounded ${getCursorClass()} ${getBackgroundClass()}`}>
      <Columns {...props} />
      <Table.DataCell className="text-center">
        <SelectMulighet
          isSelected={isSelected}
          select={selectMulighet}
          isValid={isValid}
          isLoading={isLoading}
          mulighetId={mulighet.id}
          type={type}
        />
      </Table.DataCell>
    </Table.Row>
  );
};

const Columns = ({ columns, mulighet, type }: Props): JSX.Element[] => {
  // Need this to satisfy TS
  switch (type) {
    case MulighetType.KLAGE:
      return columns.map((column) => <Cell key={column} column={column} mulighet={mulighet} />);
    case MulighetType.BEGJÆRING_OM_GJENOPPTAK:
      return columns.map((column) => <Cell key={column} column={column} mulighet={mulighet} />);
    case MulighetType.ADDITIONAL_KABAL_MULIGHET:
    case MulighetType.ANKE:
    case MulighetType.OMGJØRINGSKRAV:
      return columns.map((column) => <Cell key={column} column={column} mulighet={mulighet} />);
  }
};
