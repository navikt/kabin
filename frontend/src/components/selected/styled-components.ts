import { styled } from 'styled-components';

export const StyledTable = styled.table`
  border-spacing: 16px 0;
  width: 100%;
`;

export const TableWrapper = styled.div`
  border: 1px solid var(--a-blue-200);
  background-color: var(--a-blue-50);
  border-radius: var(--a-border-radius-medium);
  padding-top: 16px;
  padding-bottom: 16px;
`;

export const Thead = styled.thead`
  white-space: nowrap;
  text-align: left;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
