import { toast } from '@app/components/toast/store';
import { PersonDetails } from '@app/pages/registrering/person/details';
import { useCreateRegistreringMutation } from '@app/redux/api/registreringer/main';
import { Loader, Search } from '@navikt/ds-react';
import { idnr } from '@navikt/fnrvalidator';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { styled } from 'styled-components';

const LABEL = 'Opprett ny registrering';

type Orientation = 'vertical' | 'horizontal';

interface Props {
  orientation: Orientation;
}

const WHITE_SPACE = /\s/g;
const removeWhitespace = (value: string) => value.replaceAll(WHITE_SPACE, '');

export const NewRegistrering = ({ orientation }: Props) => {
  const [fnr, setFnr] = useState('');
  const [createRegistrering, { isLoading }] = useCreateRegistreringMutation();
  const navigate = useNavigate();

  const onChange = async (value: string) => {
    setFnr(value);
    const cleaned = removeWhitespace(value);

    if (idnr(cleaned).status !== 'valid') {
      return;
    }

    try {
      const { id } = await createRegistrering({ sakenGjelderValue: cleaned }).unwrap();

      toast.success('Registrering opprettet');

      navigate(`/registrering/${id}`);
    } catch {
      toast.error('Kunne ikke opprette registrering');
    }
  };

  const cleaned = removeWhitespace(fnr);
  const isValid = idnr(cleaned).status === 'valid';

  return (
    <Container $orientation={orientation}>
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
        onChange={onChange}
        value={fnr}
        disabled={isLoading}
      />

      <Loaders>
        {isValid ? <PersonDetails sakenGjelderValue={cleaned} /> : null}
        {isLoading ? (
          <SpinnerContainer>
            <Loader />
            <span>Oppretter registrering ...</span>
          </SpinnerContainer>
        ) : null}
      </Loaders>
    </Container>
  );
};

const Loaders = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const SpinnerContainer = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const StyledSearch = styled(Search)`
  width: fit-content;
`;

const Container = styled.div<{ $orientation: Orientation }>`
  display: flex;
  flex-direction: ${({ $orientation }) => ($orientation === 'vertical' ? 'column' : 'row')};
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  height: ${({ $orientation }) => ($orientation === 'vertical' ? '72px' : 'auto')};
`;
