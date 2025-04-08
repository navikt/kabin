import { useRegistrering } from '@app/hooks/use-registrering';
import { useLazyGetPartQuery } from '@app/redux/api/part';
import { useSetSakenGjelderMutation } from '@app/redux/api/registreringer/mutations';
import { Search } from '@navikt/ds-react';
import { idnr } from '@navikt/fnrvalidator';
import { useState } from 'react';
import { styled } from 'styled-components';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const PersonSearch = ({ value, onChange }: Props) => {
  const { id, sakenGjelderValue } = useRegistrering();
  const [setSakenGjelder] = useSetSakenGjelderMutation();
  const [searchPerson] = useLazyGetPartQuery();
  const [error, setError] = useState<string>();

  const onChangeInput = async (value: string) => {
    onChange(value);
    setError(undefined);

    const cleaned = value.replaceAll(/\s/g, '');
    const isValid = idnr(cleaned).status === 'valid';

    if (!isValid) {
      return;
    }

    const person = await searchPerson(cleaned).unwrap();

    if (person !== null && person.identifikator !== sakenGjelderValue) {
      setSakenGjelder({ id, sakenGjelderValue: person.identifikator });
    }
  };

  return (
    <Container>
      <Search
        value={value}
        onChange={onChangeInput}
        label="Søk etter person"
        placeholder="Søk etter person"
        hideLabel
        error={error}
        onKeyDown={({ key }) => {
          if (key === 'Escape') {
            onChange('');
          }
        }}
        onFocus={(e) => e.target.select()}
        variant="simple"
        size="small"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        autoSave="off"
        id="sakengjelder"
      >
        <Search.Button
          onClick={() => {
            const cleaned = value.replaceAll(' ', '');
            const isValid = idnr(cleaned).status === 'valid';

            if (!isValid) {
              setError('Ugyldig ID-nummer');
            }
          }}
        />
      </Search>
    </Container>
  );
};

const Container = styled.div`
  width: 250px;
`;
