import { HStack } from '@navikt/ds-react';
import type { ComponentProps } from 'react';

export interface StyleProps {
  inset?: boolean;
}

const GAP = '4px';

interface LogiskeVedleggListProps extends ComponentProps<'ul'>, StyleProps {}

export const LogiskeVedleggList = ({ inset = false, className = '', style, ...props }: LogiskeVedleggListProps) => (
  <HStack align="center" wrap overflow="visible" maxWidth="100%" width="fit-content" className="list-none">
    <ul
      className={className}
      style={{
        gridArea: 'logiske-vedlegg',
        gap: GAP,
        paddingRight: inset ? '8px' : '0',
        paddingLeft: inset ? '60px' : '0',
        paddingBottom: inset ? '4px' : '0',
        ...style,
      }}
      {...props}
    />
  </HStack>
);

interface LogiskeVedleggListItemProps extends ComponentProps<'li'> {}

export const LogiskeVedleggListItem = ({ className = '', style, ...props }: LogiskeVedleggListItemProps) => (
  <HStack asChild align="center">
    <li
      className={className}
      style={{
        maxWidth: `calc(100% - 24px - ${GAP})`,
        ...style,
      }}
      {...props}
    />
  </HStack>
);

interface NoAttachmentsTextProps extends ComponentProps<'span'> {}

export const NoAttachmentsText = ({ className = '', ...props }: NoAttachmentsTextProps) => (
  <span className={`whitespace-nowrap font-normal italic ${className}`} {...props} />
);
