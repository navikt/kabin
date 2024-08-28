import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetPartQuery } from '@app/redux/api/part';
import { useSetSakenGjelderMutation } from '@app/redux/api/registreringer/mutations';
import { Search } from '@navikt/ds-react';
import { idnr } from '@navikt/fnrvalidator';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useCallback, useEffect, useState } from 'react';
import { styled } from 'styled-components';

export const PersonSearch = () => {
  const { id, sakenGjelderValue } = useRegistrering();
  const [setSakenGjelder, { isLoading: isSetting }] = useSetSakenGjelderMutation();
  const [rawSearch, setRawSearch] = useState('');
  const [error, setError] = useState<string>();

  const cleaned = rawSearch.replaceAll(' ', '');
  const isValid = idnr(cleaned).status === 'valid';
  const search = isValid ? cleaned : skipToken;
  const { data: person, isSuccess: hasPerson } = useGetPartQuery(search);

  useEffect(() => {
    if (hasPerson && !isSetting && sakenGjelderValue !== person.id) {
      setSakenGjelder({ id, sakenGjelderValue: person.id });
    }
  }, [hasPerson, isSetting, person, sakenGjelderValue, setSakenGjelder, id]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback(({ key }) => {
    switch (key) {
      case 'Escape': {
        setRawSearch('');
        setError(undefined);
        break;
      }
    }
  }, []);

  return (
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
      id="sakengjelder"
    />
  );
};

const StyledSearch = styled(Search)`
  width: 250px;
`;
