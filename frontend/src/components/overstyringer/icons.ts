import {
  Buldings2Icon,
  EnvelopeClosedIcon,
  PersonIcon as NavPersonIcon,
  ParagraphIcon,
  PersonCheckmarkIcon,
  PersonGroupIcon,
  PersonHeadsetIcon,
} from '@navikt/aksel-icons';
import { css, styled } from 'styled-components';

const ICON_SIZE = 24;

const iconCss = css`
  align-self: center;
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  flex-shrink: 0;
`;

// Roles
export const SakenGjelderIcon = PersonCheckmarkIcon;
export const StyledSakenGjelderIcon = styled(SakenGjelderIcon)`
  ${iconCss}
`;

export const StyledKlagerIcon = styled(PersonGroupIcon)`
  ${iconCss}
`;

export const StyledFullmektigIcon = styled(ParagraphIcon)`
  ${iconCss}
`;

export const AvsenderIcon = EnvelopeClosedIcon;
export const StyledAvsenderIcon = styled(AvsenderIcon)`
  ${iconCss}
`;

const SaksbehandlerIcon = PersonHeadsetIcon;
export const StyledSaksbehandlerIcon = styled(SaksbehandlerIcon)`
  ${iconCss}
`;

// Types
export const PersonIcon = NavPersonIcon;
export const CompanyIcon = Buldings2Icon;
