import { Button, Search, Tag, Tooltip } from '@navikt/ds-react';
import type { ComponentProps } from 'react';

export enum GridArea {
  EXPAND = 'expand',
  TITLE = 'title',
  TEMA = 'tema',
  DATE = 'date',
  AVSENDER_MOTTAKER = 'avsenderMottaker',
  SAKS_ID = 'saksId',
  FAGSYSTEM = 'fagsystem',
  TYPE = 'type',
  VIEW = 'view',
  SELECT = 'select',
  ALREADY_USED = 'alreadyUsed',
}

const gridTemplateAreas = [
  GridArea.EXPAND,
  GridArea.TITLE,
  GridArea.TEMA,
  GridArea.DATE,
  GridArea.AVSENDER_MOTTAKER,
  GridArea.SAKS_ID,
  GridArea.FAGSYSTEM,
  GridArea.TYPE,
  GridArea.VIEW,
  GridArea.SELECT,
  GridArea.ALREADY_USED,
];

interface StyledGridProps extends ComponentProps<'div'> {
  showViewed?: boolean;
  as?: 'div' | 'section' | 'article';
}

export const StyledGrid = ({
  showViewed = false,
  className = '',
  as: Component = 'div',
  style,
  ...props
}: StyledGridProps) => (
  <Component
    className={`grid gap-x-2 ${showViewed ? 'bg-ax-warning-200 hover:bg-ax-warning-300' : ''} ${className}`}
    style={{
      gridTemplateRows: 'min-content min-content',
      gridTemplateColumns:
        '32px minmax(250px, 2fr) minmax(150px, 1fr) 85px minmax(170px, 2fr) 110px 100px 90px 30px 55px 20px',
      gridTemplateAreas: `'${gridTemplateAreas.join(' ')}' '${'logiske-vedlegg '.repeat(gridTemplateAreas.length).trimEnd()}'`,
      ...style,
    }}
    {...props}
  />
);

interface GridAreaProps {
  gridArea: GridArea;
}

interface GridSearchProps extends ComponentProps<typeof Search>, GridAreaProps {}

export const GridSearch = ({ gridArea, style, ...props }: GridSearchProps) => (
  <Search style={{ gridArea, ...style }} {...props} />
);

interface StyledFieldProps extends GridAreaProps {
  children: string;
}

export const SimpleTextField = ({ gridArea, children }: StyledFieldProps) => (
  <CustomTooltipField gridArea={gridArea} tooltip={children}>
    {children}
  </CustomTooltipField>
);

interface CustomTooltipFieldProps extends GridAreaProps {
  children: React.ReactNode;
  tooltip: string;
}

export const CustomTooltipField = ({ gridArea, children, tooltip }: CustomTooltipFieldProps) => (
  <Tooltip content={tooltip}>
    <span style={{ gridArea }} className="truncate">
      {children}
    </span>
  </Tooltip>
);

interface GridButtonProps extends GridAreaProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'xsmall';
  variant?: 'primary' | 'secondary' | 'tertiary' | 'tertiary-neutral' | 'danger';
  icon?: React.ReactNode;
  onMouseDown?: React.MouseEventHandler;
  onClick?: React.MouseEventHandler;
  loading?: boolean;
  title?: string;
  'aria-pressed'?: boolean;
  'data-testid'?: string;
}

export const GridButton = ({ gridArea, className = '', style, ...props }: GridButtonProps) => (
  <Button className={`relative ${className}`} style={{ gridArea, ...style }} {...props} />
);

interface GridTagProps extends ComponentProps<typeof Tag>, GridAreaProps {}

export const GridTag = ({ gridArea, className = '', style, ...props }: GridTagProps) => (
  <Tag className={`self-center ${className}`} style={{ gridArea, ...style }} {...props} />
);
