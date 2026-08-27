import { SelectMulighet } from '@app/components/muligheter/common/select-button';
import { Cell } from '@app/components/muligheter/common/table/cell';
import { MulighetType, type OtherMulighetType } from '@app/components/muligheter/common/table/types';
import { useAdditionalKabalMulighet } from '@app/hooks/use-additional-kabal-mulighet';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import {
  useSetAdditionalKabalMulighetMutation,
  useSetAnkemulighetMutation,
  useSetNonAnkemulighetMutation,
} from '@app/redux/api/registreringer/mutations';
import { SaksTypeEnum } from '@app/types/common';
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

type Props = OtherRowsProps | BegjæringOmGjenopptakMulighetRowsProps | KlagemulighetRowsProps;

export const Row = (props: Props & { selectable: boolean }) => {
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

      // `type` and `mulighet` always agree, but the props are not correlated, so `mulighetTypeId`
      // is what actually narrows the mulighet for each setter.
      switch (type) {
        case MulighetType.ANKE:
          if (mulighet.mulighetTypeId === SaksTypeEnum.ANKE) {
            setAnkemulighet({ id, mulighet });
          }
          break;
        case MulighetType.ADDITIONAL_KABAL_MULIGHET:
          if (mulighet.mulighetTypeId === SaksTypeEnum.ANKE) {
            setAdditionalKabalMulighet({ id, mulighet });
          }
          break;
        case MulighetType.OMGJØRINGSKRAV:
        case MulighetType.BEGJÆRING_OM_GJENOPPTAK:
        case MulighetType.KLAGE:
          if (mulighet.mulighetTypeId !== SaksTypeEnum.ANKE) {
            setNonAnkemulighet({ id, mulighet });
          }
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
