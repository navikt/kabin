import { StaticDataContext } from '@app/components/app/static-data-context';
import { CountryOption } from '@app/components/svarbrev/address/country/option';
import { FieldLabel } from '@app/components/svarbrev/address/layout';
import type { CountryCode } from '@app/static-data/static-data';
import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button, Search, Tag, Tooltip } from '@navikt/ds-react';
import { useCallback, useContext, useMemo, useRef, useState } from 'react';

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
        if (showCountryList) {
          setFocusIndex((prev) => (prev + 1) % options.length);
        } else {
          setShowCountryList(true);
        }

        return e.preventDefault();
      }

      if (e.key === 'ArrowUp') {
        if (showCountryList) {
          setFocusIndex((prev) => (prev === 0 ? options.length - 1 : prev - 1));
        } else {
          setShowCountryList(true);
        }

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
    <div className="relative">
      <Search
        size="small"
        label={
          <FieldLabel>
            Land
            <Tag data-color="info" size="xsmall" variant="outline">
              Påkrevd
            </Tag>
            {isOverridden ? (
              <Tag data-color="warning" size="xsmall" variant="outline">
                Overstyrt
              </Tag>
            ) : null}
            {isOverridden ? (
              <Tooltip content={`Tilbakestill til «${originalCountryName}»`}>
                <Button
                  data-color="neutral"
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
        <ul className="absolute top-full left-0 z-1 max-h-50 w-full overflow-x-auto rounded bg-ax-bg-default shadow-ax-shadow-dialog">
          {options.map((country, i) => (
            <CountryOption
              key={country.landkode}
              country={country}
              isFocused={i === focusIndex}
              isSelected={country.landkode === value}
              onClick={onSelect}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
};
