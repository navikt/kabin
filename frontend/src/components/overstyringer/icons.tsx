import {
  Buildings2Icon,
  EnvelopeClosedIcon,
  PersonIcon as NavPersonIcon,
  ParagraphIcon,
  PersonCheckmarkIcon,
  PersonGroupIcon,
  PersonHeadsetIcon,
} from '@navikt/aksel-icons';
import type { ComponentProps } from 'react';

const ICON_CLASS = 'self-center w-6 h-6 shrink-0';

// Roles
export const SakenGjelderIcon = PersonCheckmarkIcon;

interface IconProps extends ComponentProps<typeof PersonCheckmarkIcon> {}

export const StyledSakenGjelderIcon = ({ className = '', ...props }: IconProps) => (
  <SakenGjelderIcon className={`${ICON_CLASS} ${className}`} {...props} />
);

export const StyledKlagerIcon = ({ className = '', ...props }: ComponentProps<typeof PersonGroupIcon>) => (
  <PersonGroupIcon className={`${ICON_CLASS} ${className}`} {...props} />
);

export const StyledFullmektigIcon = ({ className = '', ...props }: ComponentProps<typeof ParagraphIcon>) => (
  <ParagraphIcon className={`${ICON_CLASS} ${className}`} {...props} />
);

export const AvsenderIcon = EnvelopeClosedIcon;
export const StyledAvsenderIcon = ({ className = '', ...props }: ComponentProps<typeof EnvelopeClosedIcon>) => (
  <AvsenderIcon className={`${ICON_CLASS} ${className}`} {...props} />
);

const SaksbehandlerIcon = PersonHeadsetIcon;
export const StyledSaksbehandlerIcon = ({ className = '', ...props }: ComponentProps<typeof PersonHeadsetIcon>) => (
  <SaksbehandlerIcon className={`${ICON_CLASS} ${className}`} {...props} />
);

// Types
export const PersonIcon = NavPersonIcon;
export const CompanyIcon = Buildings2Icon;
