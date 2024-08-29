import { toast } from '@app/components/toast/store';
import { PersonDetails } from '@app/pages/registrering/person/details';
import { useGetPartQuery } from '@app/redux/api/part';
import { useCreateRegistreringMutation } from '@app/redux/api/registreringer/main';
import { Loader, Search } from '@navikt/ds-react';
import { idnr } from '@navikt/fnrvalidator';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { styled } from 'styled-components';

const LABEL = 'Opprett ny registrering';

type Orientation = 'vertical' | 'horizontal';

interface Props {
  orientation: Orientation;
}

export const NewRegistrering = ({ orientation }: Props) => {
  const [fnr, setFnr] = useState('');
  const [createRegistrering, { isLoading, isSuccess }] = useCreateRegistreringMutation();
  const navigate = useNavigate();

  const cleaned = fnr.replaceAll(' ', '');
  const isValid = idnr(cleaned).status === 'valid';

  const create = useCallback(async () => {
    try {
      const { data } = await createRegistrering({ sakenGjelderValue: cleaned });
      navigate(`/registrering/${data?.id}`);
      toast.success('Registrering opprettet');
    } catch {
      toast.error('Kunne ikke opprette registrering');
    }
  }, [createRegistrering, cleaned, navigate]);

  useEffect(() => {
    if (!isValid || isLoading || isSuccess) {
      return;
    }

    create();
  }, [isValid, isLoading, isSuccess, create]);

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
        onChange={setFnr}
        value={fnr}
      />

      <Loaders>
        {isValid ? <PersonInfo sakenGjelderValue={cleaned} /> : null}
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

interface PersonInfoProps {
  sakenGjelderValue: string;
}

const PersonInfo = ({ sakenGjelderValue }: PersonInfoProps) => {
  const { data } = useGetPartQuery(sakenGjelderValue);

  if (data === undefined) {
    return null;
  }

  return <PersonDetails person={data} />;
};
