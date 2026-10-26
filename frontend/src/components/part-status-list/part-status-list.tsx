import { isoDateToPretty } from '@app/domain/date';
import { type IOrganizationStatus, type IPart, type IPersonStatus, PartStatusEnum } from '@app/types/common';
import { FlowerPetalFallingIcon } from '@navikt/aksel-icons';
import { HStack, Tag, type TagProps } from '@navikt/ds-react';

interface Props extends Pick<IPart, 'statusList'> {
  className?: string;
}

export const PartStatusList = ({ statusList = [], className }: Props) => {
  if (statusList.length === 0) {
    return null;
  }

  return (
    <HStack gap="space-4" wrap className={className}>
      {statusList.map((s) => (
        <PartStatus partStatus={s} key={s.status} />
      ))}
    </HStack>
  );
};

interface IStatusProps {
  partStatus: IPersonStatus | IOrganizationStatus;
}

const PartStatus = ({ partStatus }: IStatusProps) => {
  if (partStatus.date === null) {
    return (
      <Tag variant="outline" data-color={STATUS_COLOR[partStatus.status]} size="small">
        {STATUS_NAMES[partStatus.status]}
      </Tag>
    );
  }

  return (
    <Tag variant="outline" data-color={STATUS_COLOR[partStatus.status]} size="small">
      {STATUS_NAMES[partStatus.status]} ({isoDateToPretty(partStatus.date)})
    </Tag>
  );
};

const STATUS_NAMES: Record<PartStatusEnum, React.ReactNode> = {
  [PartStatusEnum.DEAD]: (
    <>
      <FlowerPetalFallingIcon aria-hidden /> Død
    </>
  ),
  [PartStatusEnum.DELETED]: 'Avviklet',
  [PartStatusEnum.EGEN_ANSATT]: 'Egen ansatt',
  [PartStatusEnum.VERGEMAAL]: 'Vergemål',
  [PartStatusEnum.FULLMAKT]: 'Fullmakt',
  [PartStatusEnum.FORTROLIG]: 'Fortrolig',
  [PartStatusEnum.STRENGT_FORTROLIG]: 'Strengt fortrolig',
  [PartStatusEnum.RESERVERT_I_KRR]: 'Reservert i KRR',
  [PartStatusEnum.DELT_ANSVAR]: 'Delt ansvar',
};

const STATUS_COLOR: Record<PartStatusEnum, TagProps['data-color']> = {
  [PartStatusEnum.DEAD]: 'danger',
  [PartStatusEnum.DELETED]: 'danger',
  [PartStatusEnum.EGEN_ANSATT]: 'warning',
  [PartStatusEnum.VERGEMAAL]: 'success',
  [PartStatusEnum.FULLMAKT]: 'success',
  [PartStatusEnum.FORTROLIG]: 'info',
  [PartStatusEnum.STRENGT_FORTROLIG]: 'meta-purple',
  [PartStatusEnum.RESERVERT_I_KRR]: 'warning',
  [PartStatusEnum.DELT_ANSVAR]: 'info',
};
