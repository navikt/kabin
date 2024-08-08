import { Search } from '@navikt/ds-react';
import { idnr } from '@navikt/fnrvalidator';
import { useNavigate } from 'react-router';
import { styled } from 'styled-components';
import { toast } from '@app/components/toast/store';
import { useLazyGetPartQuery } from '@app/redux/api/part';
import { useCreateRegistreringMutation } from '@app/redux/api/registreringer/main';

const LABEL = 'Opprett ny registrering';

export const NewRegistrering = () => {
  const [create] = useCreateRegistreringMutation();
  const navigate = useNavigate();
  const [getPerson] = useLazyGetPartQuery();

  return (
    <StyledSearch
      hideLabel
      label={LABEL}
      placeholder={LABEL}
      size="small"
      variant="simple"
      htmlSize={22}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      onChange={async (value: string) => {
        const cleaned = value.replaceAll(' ', '');
        const isValid = idnr(cleaned).status === 'valid';

        if (!isValid) {
          return;
        }

        try {
          const person = await getPerson(cleaned, true).unwrap();
          const { id } = await create({ sakenGjelderValue: person.id }).unwrap();
          navigate(`/registrering/${id}`);
          toast.success('Registrering opprettet');
        } catch {
          toast.error('Kunne ikke opprette registrering');
        }
      }}
    />
  );
};

const StyledSearch = styled(Search)`
  width: fit-content;
`;
