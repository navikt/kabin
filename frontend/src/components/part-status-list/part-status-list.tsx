import { isoDateToPretty } from '@app/domain/date';
import { type IOrganizationStatus, type IPart, type IPersonStatus, PartStatusEnum } from '@app/types/common';
import { FlowerPetalFallingIcon } from '@navikt/aksel-icons';
import { Tag, type TagProps } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props extends Pick<IPart, 'statusList'> {
  /**
   * @default undefined
   * The variant of the tag. If undefined, the variant will be automatically set.
   */
  variant?: TagProps['variant'];
  className?: string;
}

export const PartStatusList = ({ statusList = [], variant, className }: Props) => {
  if (statusList.length === 0) {
    return null;
  }

  return (
    <Container className={className}>
      {statusList.map((s) => (
        <PartStatus partStatus={s} size="small" variant={variant} key={s.status} />
      ))}
    </Container>
  );
};

interface IStatusProps {
  partStatus: IPersonStatus | IOrganizationStatus;
  size?: TagProps['size'];
  variant?: TagProps['variant'];
}

const PartStatus = ({ partStatus, size, variant = STATUS_VARIANT[partStatus.status] }: IStatusProps) => {
  if (partStatus.date === null) {
    return (
      <Tag variant={variant} size={size}>
        {STATUS_NAMES[partStatus.status]}
      </Tag>
    );
  }

  return (
    <Tag variant={variant} size={size}>
      {STATUS_NAMES[partStatus.status]} ({isoDateToPretty(partStatus.date)})
    </Tag>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
`;

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

const STATUS_VARIANT: Record<PartStatusEnum, TagProps['variant']> = {
  [PartStatusEnum.DEAD]: 'error',
  [PartStatusEnum.DELETED]: 'error',
  [PartStatusEnum.EGEN_ANSATT]: 'warning',
  [PartStatusEnum.VERGEMAAL]: 'success',
  [PartStatusEnum.FULLMAKT]: 'success',
  [PartStatusEnum.FORTROLIG]: 'info',
  [PartStatusEnum.STRENGT_FORTROLIG]: 'alt1',
  [PartStatusEnum.RESERVERT_I_KRR]: 'warning',
  [PartStatusEnum.DELT_ANSVAR]: 'info',
};
