import { styled } from 'styled-components';

export interface StyleProps {
  $inset?: boolean;
}

export const LogiskeVedleggList = styled.ul<StyleProps>`
  grid-area: logiske-vedlegg;
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  gap: 4px;
  flex-wrap: wrap;
  padding-right: ${({ $inset }) => ($inset === true ? '8px' : '0')};
  padding-left: ${({ $inset }) => ($inset === true ? '32px' : '0')};
  padding-bottom: ${({ $inset }) => ($inset === true ? '4px' : '0')};
  align-items: center;
  width: fit-content;
`;

export const LogiskeVedleggListItem = styled.li`
  display: flex;
  align-items: center;
`;

export const NoAttachmentsText = styled.span`
  font-weight: normal;
  font-style: italic;
`;
