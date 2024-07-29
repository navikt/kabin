import { Button, Search } from '@navikt/ds-react';
import { idnr } from '@navikt/fnrvalidator';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useCallback, useState } from 'react';
import { styled } from 'styled-components';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { PersonDetails } from '@app/pages/create/person/details';
import { useGetPartQuery } from '@app/redux/api/part';
import { useSetSakenGjelderMutation } from '@app/redux/api/registrering';

export const PersonSearch = () => {
  const registreringId = useRegistreringId();
  const [setSakenGjelder, { isLoading: isSetting }] = useSetSakenGjelderMutation();
  const [rawSearch, setRawSearch] = useState('');
  const [error, setError] = useState<string>();

  const cleaned = rawSearch.replaceAll(' ', '');
  const isValid = idnr(cleaned).status === 'valid';
  const search = isValid ? cleaned : skipToken;
  const { data: person } = useGetPartQuery(search);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = ({ key }) => {
    if (key === 'Escape') {
      setRawSearch('');

      return;
    }

    if (key !== 'Enter') {
      return;
    }

    setError(isValid ? undefined : 'Ugyldig ID-nummer');
  };

  const onSelect = useCallback(() => {
    if (person !== undefined) {
      setSakenGjelder({ id: registreringId, sakenGjelderValue: person.id });
    }

    if (error !== undefined) {
      setError(undefined);
    }
  }, [error, person, registreringId, setSakenGjelder]);

  return (
    <>
      <StyledSearch
        value={rawSearch}
        onChange={setRawSearch}
        label="Søk etter person"
        placeholder="Søk etter person"
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

      {isValid && search !== skipToken ? (
        <>
          <PersonDetails person={person} />
          <Button size="small" variant="primary" onClick={onSelect} loading={isSetting || person === undefined}>
            Velg
          </Button>
        </>
      ) : null}
    </>
  );
};

const StyledSearch = styled(Search)`
  width: 250px;
`;
