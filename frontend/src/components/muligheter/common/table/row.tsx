import { SelectMulighet } from '@app/components/muligheter/common/select-button';
import { Cell } from '@app/components/muligheter/common/table/cell';
import { type MulighetMap, MulighetType } from '@app/components/muligheter/common/table/types';
import { useAdditionalKabalMulighet } from '@app/hooks/use-additional-kabal-mulighet';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import {
  useSetAdditionalKabalMulighetMutation,
  useSetAnkemulighetMutation,
  useSetNonAnkemulighetMutation,
} from '@app/redux/api/registreringer/mutations';
import { Table } from '@navikt/ds-react';
import { type JSX, useCallback } from 'react';

type Props = {
  [T in MulighetType]: {
    isValid: boolean;
    selectable: boolean;
    type: T;
    mulighet: MulighetMap[T];
    columns: (keyof MulighetMap[T])[];
  };
}[MulighetType];

const useIsSelected = (type: MulighetType, mulighetId: string): boolean => {
  const additionalKabalMulighet = useAdditionalKabalMulighet();
  const { mulighet: selectedMulighet } = useMulighet();

  switch (type) {
    case MulighetType.ADDITIONAL_KABAL_MULIGHET:
      return additionalKabalMulighet?.id === mulighetId;
    case MulighetType.ANKE:
    case MulighetType.OMGJØRINGSKRAV:
    case MulighetType.BEGJÆRING_OM_GJENOPPTAK:
    case MulighetType.KLAGE: {
      return selectedMulighet?.id === mulighetId;
    }
  }
};

export const Row = (props: Props) => {
  const { mulighet, type, isValid, selectable } = props;
  const { id } = useRegistrering();
  const canEdit = useCanEdit();
  const [setAnkemulighet, { isLoading: isLoadingAnkemulighet }] = useSetAnkemulighetMutation();
  const [setNonAnkemulighet, { isLoading: isLoadingNonAnkemulighet }] = useSetNonAnkemulighetMutation();
  const [setAdditionalKabalMulighet, { isLoading: isLoadingAdditionalKabalMulighet }] =
    useSetAdditionalKabalMulighetMutation();

  const isSelected = useIsSelected(type, mulighet.id);

  const getCursorClass = () => (selectable && isValid && canEdit ? 'cursor-pointer' : 'cursor-default');
  const getBackgroundClass = () =>
    !isValid && isSelected ? 'bg-ax-bg-danger-soft hover:bg-ax-bg-danger-moderate-hover' : '';

  const isLoading = isLoadingAnkemulighet || isLoadingNonAnkemulighet || isLoadingAdditionalKabalMulighet;

  const selectMulighet = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isValid || isSelected) {
        return;
      }

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
    },
    [isValid, mulighet, id, isSelected, setAnkemulighet, setNonAnkemulighet, setAdditionalKabalMulighet, type],
  );

  return (
    <Table.Row
      selected={isSelected}
      onClick={selectable ? selectMulighet : undefined}
      className={`rounded ${getCursorClass()} ${getBackgroundClass()}`}
    >
      <Columns {...props} />
      {selectable ? <SelectCell {...props} selectMulighet={selectMulighet} isLoading={isLoading} /> : null}
    </Table.Row>
  );
};

interface SelectCellProps {
  selectMulighet: (e: React.MouseEvent) => void;
  isLoading: boolean;
}

const SelectCell = ({ mulighet, type, isValid, isLoading, selectMulighet }: SelectCellProps & Props) => {
  const isSelected = useIsSelected(type, mulighet.id);

  return (
    <Table.DataCell className="text-center">
      <SelectMulighet
        isSelected={isSelected}
        select={selectMulighet}
        isValid={isValid}
        isLoading={isLoading}
        mulighet={mulighet}
      />
    </Table.DataCell>
  );
};

// Every case renders the same cell, but each one has to be listed separately for TS to keep
// `columns` and `mulighet` correlated.
const Columns = ({ type, columns, mulighet }: Props): JSX.Element[] => {
  switch (type) {
    case MulighetType.KLAGE:
      return columns.map((column) => <Cell key={column} column={column} mulighet={mulighet} />);
    case MulighetType.BEGJÆRING_OM_GJENOPPTAK:
      return columns.map((column) => <Cell key={column} column={column} mulighet={mulighet} />);
    case MulighetType.ANKE:
      return columns.map((column) => <Cell key={column} column={column} mulighet={mulighet} />);
    case MulighetType.OMGJØRINGSKRAV:
      return columns.map((column) => <Cell key={column} column={column} mulighet={mulighet} />);
    case MulighetType.ADDITIONAL_KABAL_MULIGHET:
      return columns.map((column) => <Cell key={column} column={column} mulighet={mulighet} />);
  }
};
