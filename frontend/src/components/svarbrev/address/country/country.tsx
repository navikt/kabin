import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button, Search, Tag, Tooltip } from '@navikt/ds-react';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { CountryOption } from '@app/components/svarbrev/address/country/option';
import { FieldLabel, Row } from '@app/components/svarbrev/address/layout';
import { CountryCode } from '@app/static-data/static-data';

interface Props {
  value?: string;
  originalValue?: string;
  onChange: (landkode: string) => void;
}

export const Country = ({ value = 'NO', originalValue = 'NO', onChange }: Props) => {
  const { countryCodeList, getCountryName } = useContext(StaticDataContext);
  const isOverridden = value !== originalValue;
  const currentCountryName = getCountryName(value) ?? value;
  const originalCountryName = getCountryName(originalValue) ?? originalValue;
  const [search, setSearch] = useState(currentCountryName);
  const [showCountryList, setShowCountryList] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const countryNameRef = useRef(currentCountryName);

  const maxCountrySize = useMemo(
    () => countryCodeList.reduce((max, { land }) => (land.length > max ? land.length : max), 0),
    [countryCodeList],
  );

  const options = useMemo(
    () => countryCodeList.filter((country) => country.land.toLowerCase().includes(search.toLowerCase())),
    [countryCodeList, search],
  );

  const focusedOption = options.at(focusIndex);

  const onSelect = useCallback(
    (country: CountryCode) => {
      countryNameRef.current = country.land;
      setShowCountryList(false);
      onChange(country.landkode);
      setSearch(country.land);
    },
    [onChange],
  );

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.key === 'ArrowDown') {
        showCountryList ? setFocusIndex((prev) => (prev + 1) % options.length) : setShowCountryList(true);

        return e.preventDefault();
      }

      if (e.key === 'ArrowUp') {
        showCountryList
          ? setFocusIndex((prev) => (prev === 0 ? options.length - 1 : prev - 1))
          : setShowCountryList(true);

        return e.preventDefault();
      }

      if (e.key === 'End') {
        setFocusIndex(options.length - 1);

        return e.preventDefault();
      }

      if (e.key === 'Home') {
        setFocusIndex(0);

        return e.preventDefault();
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();

        if (showCountryList && focusedOption !== undefined) {
          onSelect(focusedOption);
        }

        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();

        if (showCountryList) {
          setShowCountryList(false);
        } else {
          setFocusIndex(0);
          setSearch('');
        }
      }
    },
    [showCountryList, options.length, focusedOption, onSelect],
  );

  return (
    <Container>
      <Row>
        <Container>
          <Search
            size="small"
            label={
              <FieldLabel>
                Land
                <Tag size="xsmall" variant="info">
                  Påkrevd
                </Tag>
                {isOverridden ? (
                  <Tag size="xsmall" variant="warning">
                    Overstyrt
                  </Tag>
                ) : null}
                {isOverridden ? (
                  <Tooltip content={`Tilbakestill til «${originalCountryName}»`}>
                    <Button
                      size="xsmall"
                      variant="tertiary"
                      onClick={() => {
                        countryNameRef.current = originalCountryName;
                        onChange(originalValue);
                        setSearch(originalCountryName);
                        searchRef.current?.focus();
                        setShowCountryList(false);
                      }}
                      icon={<ArrowUndoIcon aria-hidden />}
                    />
                  </Tooltip>
                ) : null}
              </FieldLabel>
            }
            hideLabel={false}
            value={search}
            variant="simple"
            placeholder={search.length === 0 ? 'Velg land' : undefined}
            onChange={(v) => {
              setSearch(v);
              setShowCountryList(true);
            }}
            htmlSize={maxCountrySize + 15}
            onFocus={() => setShowCountryList(true)}
            onBlur={() =>
              setTimeout(() => {
                setShowCountryList(false);
                setSearch(countryNameRef.current);
              }, 100)
            }
            onKeyDown={onKeyDown}
            ref={searchRef}
          />
          {showCountryList ? (
            <DropdownList>
              {options.map((country, i) => (
                <CountryOption
                  key={country.landkode}
                  country={country}
                  isFocused={i === focusIndex}
                  isSelected={country.landkode === value}
                  onClick={onSelect}
                />
              ))}
            </DropdownList>
          ) : null}
        </Container>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: fit-content;
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  width: 100%;
  left: 0;
  padding: 0;
  background-color: white;
  border-radius: var(--a-border-radius-medium);
  box-shadow: var(--a-shadow-medium);
  z-index: 1;
  max-height: 200px;
  overflow-x: auto;
`;
