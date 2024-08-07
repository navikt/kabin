import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Alert, Button, Search } from '@navikt/ds-react';
import { idnr } from '@navikt/fnrvalidator';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useCallback, useState } from 'react';
import { styled } from 'styled-components';
import { useRegistrering } from '@app/hooks/use-registrering';
import { PersonDetails } from '@app/pages/registrering/person/details';
import { useGetPartQuery } from '@app/redux/api/part';
import { useSetSakenGjelderMutation } from '@app/redux/api/registreringer/mutations';

interface Props {
  onDone: () => void;
}

export const PersonSearch = ({ onDone }: Props) => {
  const { id, sakenGjelderValue } = useRegistrering();
  const [setSakenGjelder, { isLoading: isSetting }] = useSetSakenGjelderMutation();
  const [rawSearch, setRawSearch] = useState('');
  const [error, setError] = useState<string>();

  const cleaned = rawSearch.replaceAll(' ', '');
  const isValid = idnr(cleaned).status === 'valid';
  const search = isValid ? cleaned : skipToken;
  const { data: person } = useGetPartQuery(search);

  const onSelect = useCallback(() => {
    if (!isValid) {
      return setError('Ugyldig ID-nummer');
    }

    if (person !== undefined) {
      setSakenGjelder({ id, sakenGjelderValue: person.id });
      setError(undefined);
    }

    onDone();
  }, [id, isValid, onDone, person, setSakenGjelder]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback(
    ({ key }) => {
      switch (key) {
        case 'Escape': {
          setRawSearch('');
          setError(undefined);
          onDone();
          break;
        }
        case 'Enter': {
          onSelect();
          break;
        }
      }
    },
    [onDone, onSelect],
  );

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
          <Button
            size="small"
            variant="primary"
            onClick={onSelect}
            loading={isSetting || person === undefined}
            icon={<CheckmarkIcon role="presentation" aria-hidden />}
          >
            Velg
          </Button>
          <Button
            size="small"
            variant="secondary"
            onClick={onDone}
            loading={isSetting}
            icon={<XMarkIcon role="presentation" aria-hidden />}
          >
            Avbryt
          </Button>
        </>
      ) : null}

      {sakenGjelderValue === null ? (
        <Alert variant="info" size="small" inline>
          Velg person
        </Alert>
      ) : null}
    </>
  );
};

const StyledSearch = styled(Search)`
  width: 250px;
`;
