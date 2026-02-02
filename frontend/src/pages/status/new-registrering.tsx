import { toast } from '@app/components/toast/store';
import { PersonDetails } from '@app/pages/registrering/person/details';
import { useCreateRegistreringMutation } from '@app/redux/api/registreringer/main';
import { HStack, Loader, Search, VStack } from '@navikt/ds-react';
import { idnr } from '@navikt/fnrvalidator';
import { useState } from 'react';
import { useNavigate } from 'react-router';

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

  const isVertical = orientation === 'vertical';

  const Container = isVertical ? VStack : HStack;

  return (
    <Container align="center" justify="start" gap="space-8" className={isVertical ? 'h-18' : undefined}>
      <Search
        className="w-fit"
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

      <HStack gap="space-8" align="center">
        {isValid ? <PersonDetails sakenGjelderValue={cleaned} /> : null}
        {isLoading ? (
          <HStack gap="space-4" align="center">
            <Loader />
            <span>Oppretter registrering ...</span>
          </HStack>
        ) : null}
      </HStack>
    </Container>
  );
};
