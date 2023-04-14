import {
  Buldings2Icon,
  EnvelopeClosedIcon,
  PersonIcon as NavPersonIcon,
  ParagraphIcon,
  PersonCheckmarkIcon,
  PersonGroupIcon,
} from '@navikt/aksel-icons';
import styled, { css } from 'styled-components';

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

export const KlagerIcon = PersonGroupIcon;
export const StyledKlagerIcon = styled(KlagerIcon)`
  ${iconCss}
`;

export const FullmektigIcon = ParagraphIcon;
export const StyledFullmektigIcon = styled(FullmektigIcon)`
  ${iconCss}
`;

export const AvsenderIcon = EnvelopeClosedIcon;
export const StyledAvsenderIcon = styled(AvsenderIcon)`
  ${iconCss}
`;

// Types
export const PersonIcon = NavPersonIcon;
export const CompanyIcon = Buldings2Icon;
