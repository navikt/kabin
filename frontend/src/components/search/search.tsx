import { Search } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { IPersonSearch } from './hook';
import { SearchDetails } from './search-details';

interface Props extends IPersonSearch {
  // onChange: (search: string | typeof skipToken) => void;
  isInitialized: boolean;
}
// const { search, rawSearch, error, person, isLoading, isValid, onRawChange, onKeyDown } = usePersonSearch(onChange);

export const PersonSearch = ({
  isInitialized,
  rawSearch,
  search,
  person,
  isValid,
  isLoading,
  error,
  onRawChange,
  onKeyDown,
}: Props) => (
  <SearchArea $isInitialized={isInitialized}>
    <StyledSearch
      value={rawSearch}
      onChange={onRawChange}
      label="Søk på ID-nummer"
      placeholder="Søk på ID-nummer"
      hideLabel={true}
      error={error}
      onKeyDown={onKeyDown}
      onFocus={(e) => e.target.select()}
      variant="simple"
      size={isInitialized ? 'small' : 'medium'}
      autoFocus
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      autoSave="off"
    />
    <SearchDetails
      person={person}
      searchString={search}
      isLoading={isLoading}
      isValid={isValid}
      isInitialized={isInitialized}
    />
  </SearchArea>
);

const SearchArea = styled.div<{ $isInitialized: boolean }>`
  grid-area: search;
  display: flex;
  flex-direction: row;
  gap: 16px;
  justify-content: ${({ $isInitialized }) => ($isInitialized ? 'flex-start' : 'center')};
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 16px;
  padding-bottom: 8px;
  background-color: white;
`;

const StyledSearch = styled(Search)`
  width: 250px;
`;
