import { styled } from 'styled-components';

export interface StyleProps {
  $inset?: boolean;
}

const GAP = '4px';

export const LogiskeVedleggList = styled.ul<StyleProps>`
  grid-area: logiske-vedlegg;
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  gap: ${GAP};
  flex-wrap: wrap;
  padding-right: ${({ $inset }) => ($inset === true ? '8px' : '0')};
  padding-left: ${({ $inset }) => ($inset === true ? '32px' : '0')};
  padding-bottom: ${({ $inset }) => ($inset === true ? '4px' : '0')};
  align-items: center;
  width: fit-content;
  max-width: 100%;
  overflow: hidden;
`;

export const LogiskeVedleggListItem = styled.li`
  display: flex;
  align-items: center;
  max-width: calc(100% - 24px - ${GAP});
`;

export const NoAttachmentsText = styled.span`
  font-weight: normal;
  font-style: italic;
`;
