import { Search } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { IPersonSearch } from './hook';
import { SearchDetails } from './search-details';

interface Props extends IPersonSearch {
  isInitialized: boolean;
  label?: string;
}

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
  label = 'Søk på ID-nummer',
}: Props) => (
  <>
    <StyledSearch
      value={rawSearch}
      onChange={onRawChange}
      label={label}
      placeholder={label}
      hideLabel
      error={error}
      onKeyDown={onKeyDown}
      onFocus={(e) => e.target.select()}
      variant="simple"
      size="small"
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
  </>
);

export const SearchArea = styled.div<{ $isInitialized: boolean }>`
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
