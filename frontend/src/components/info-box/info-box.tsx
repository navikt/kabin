import {
  CheckmarkCircleIcon,
  ExclamationmarkTriangleIcon,
  InformationSquareIcon,
  XMarkOctagonIcon,
} from '@navikt/aksel-icons';
import { InfoCard, type InfoCardProps } from '@navikt/ds-react';

type Variant = Extract<NonNullable<InfoCardProps['data-color']>, 'info' | 'success' | 'warning' | 'danger'>;

interface Props extends Omit<InfoCardProps, 'data-color' | 'size'> {
  variant: Variant;
}

export const InfoBox = ({ children, variant, ...props }: Props) => (
  <InfoCard {...props} data-color={variant} size="small">
    <InfoCard.Message icon={ICONS[variant]}>{children}</InfoCard.Message>
  </InfoCard>
);

const ICONS: Record<Variant, React.ReactNode> = {
  info: <InformationSquareIcon aria-hidden />,
  warning: <ExclamationmarkTriangleIcon aria-hidden />,
  danger: <XMarkOctagonIcon aria-hidden />,
  success: <CheckmarkCircleIcon aria-hidden />,
};
