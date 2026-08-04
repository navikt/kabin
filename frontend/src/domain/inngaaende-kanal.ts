import { InngaaendeKanal } from '@app/redux/api/registreringer/types';
import type { TagProps } from '@navikt/ds-react';

export const INNGAAENDE_KANAL_NAMES: Record<InngaaendeKanal, string> = {
  [InngaaendeKanal.E_POST]: 'E-post',
  [InngaaendeKanal.ALTINN_INNBOKS]: 'Altinn innboks',
};

export const INNGAAENDE_KANAL_COLORS: Record<InngaaendeKanal, TagProps['data-color']> = {
  [InngaaendeKanal.E_POST]: 'meta-purple',
  [InngaaendeKanal.ALTINN_INNBOKS]: 'accent',
};
