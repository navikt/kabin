import { Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  usedCount: number;
}

export const UsedCount = ({ usedCount }: Props) =>
  usedCount === 0 ? null : (
    <NowrapTag variant="warning" size="small">
      Brukt til {usedCount} anke{usedCount > 1 ? 'r' : ''}
    </NowrapTag>
  );

const NowrapTag = styled(Tag)`
  white-space: nowrap;
`;
