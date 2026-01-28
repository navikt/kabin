import { toast } from '@app/components/toast/store';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { PersonDetails } from '@app/pages/registrering/person/details';
import { FnrInput } from '@app/pages/registrering/person/fnr';
import { useLazyGetPartQuery } from '@app/redux/api/part';
import { useSetSakenGjelderMutation } from '@app/redux/api/registreringer/mutations';
import { useGetRegistreringQuery } from '@app/redux/api/registreringer/queries';
import { ArrowsSquarepathIcon, CircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack, Label, Loader, Tag } from '@navikt/ds-react';
import { useCallback, useId, useState } from 'react';

export const Person = () => {
  const { id, sakenGjelderValue } = useRegistrering();
  const { refetch, isFetching: isFetchingRegistrering } = useGetRegistreringQuery(id);
  const canEdit = useCanEdit();
  const [inputValue, setInputValue] = useState<string>('');
  const [setSakenGjelder, { isLoading: isSettingSakenGjelder }] = useSetSakenGjelderMutation();
  const [setSakenGjelderError, setSetSakenGjelderError] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [isSame, setIsSame] = useState(false);

  const [searchPerson, { data: searchedPerson = null, isFetching: isSearching, isSuccess: isSearchSuccess }] =
    useLazyGetPartQuery();

  const showError = useCallback((message: string) => {
    setSetSakenGjelderError(message);
    toast.error(message);
  }, []);

  const updateSakenGjelder = useCallback(
    async (sakenGjelderValue: string) => {
      try {
        await setSakenGjelder({ id, sakenGjelderValue }).unwrap();
        setSetSakenGjelderError(null);
        setInputValue('');
        setInputError(null);
        toast.success('Saken gjelder er endret.');
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Kunne ikke endre saken gjelder.');
      }
    },
    [id, setSakenGjelder, showError],
  );

  const onFnrChange = useCallback(
    async (value: string | null) => {
      setSetSakenGjelderError(null);

      if (value === null) {
        return;
      }

      const isSame = value === sakenGjelderValue;
      setIsSame(isSame);

      if (isSame) {
        return;
      }

      const searchedPerson = await searchPerson(value).unwrap();

      if (searchedPerson === null) {
        return showError('Fant ingen person med dette fødselsnummeret.');
      }

      if (setSakenGjelderError === null) {
        updateSakenGjelder(searchedPerson.identifikator);
      }
    },
    [searchPerson, updateSakenGjelder, setSakenGjelderError, sakenGjelderValue, showError],
  );

  const retry = useCallback(
    async (identifikator: string) => {
      const { data } = await refetch();

      if (data === undefined) {
        return showError('Kan ikke endre saken gjelder. Registreringen finnes ikke.');
      }

      if (data.finished !== null) {
        return showError('Kan ikke endre saken gjelder. Registreringen er ferdigstilt.');
      }

      updateSakenGjelder(identifikator);
    },
    [updateSakenGjelder, refetch, showError],
  );

  const sakenGjelderLabelId = useId();

  if (!canEdit) {
    return sakenGjelderValue === null ? (
      <Container>
        <Tag data-color="info" variant="outline" size="small">
          <i>Ingen person valgt</i>
        </Tag>
      </Container>
    ) : (
      <Container>
        <PersonDetails sakenGjelderValue={sakenGjelderValue} />
      </Container>
    );
  }

  const canRetry = !isSearching && isSearchSuccess && !isSame && searchedPerson !== null;

  return (
    <Container>
      {sakenGjelderValue === null ? null : (
        <HStack
          align="center"
          gap="space-4"
          className="border-ax-border-neutral border-r"
          paddingInline="space-0 space-16"
        >
          <Label htmlFor={sakenGjelderLabelId}>Saken gjelder</Label>
          <PersonDetails sakenGjelderValue={sakenGjelderValue} id={sakenGjelderLabelId} variant="success" />
        </HStack>
      )}
      <HStack gap="space-4" align="start">
        <FnrInput
          value={inputValue}
          onChange={setInputValue}
          onFnrChange={onFnrChange}
          onInputError={setInputError}
          placeholder="Bytt saken gjelder"
        />

        {inputError === null ? null : (
          <Tag data-color="danger" variant="outline" className="gap-1">
            <XMarkOctagonIcon aria-hidden /> <span>{inputError}</span>
          </Tag>
        )}

        {isSearching ? (
          <Tag data-color="info" variant="outline" className="gap-1">
            <Loader size="small" /> <span>Søker etter person...</span>
          </Tag>
        ) : null}

        {isSettingSakenGjelder ? (
          <Tag data-color="info" variant="outline" className="gap-1">
            <Loader size="small" /> <span>Bytter saken gjelder...</span>
          </Tag>
        ) : null}

        {isSame ? (
          <Tag data-color="neutral" variant="outline" className="gap-1">
            <CircleIcon aria-hidden /> <span>Allerede satt som saken gjelder</span>
          </Tag>
        ) : null}

        {setSakenGjelderError === null ? null : (
          <Tag data-color="danger" variant="outline" className="gap-1">
            <XMarkOctagonIcon aria-hidden /> <span>{setSakenGjelderError}</span>
          </Tag>
        )}

        {setSakenGjelderError === null ? null : (
          <Button
            onClick={canRetry ? () => retry(searchedPerson.identifikator) : undefined}
            variant="primary"
            size="small"
            icon={<ArrowsSquarepathIcon aria-hidden />}
            loading={isFetchingRegistrering || isSettingSakenGjelder}
            disabled={!canRetry}
          >
            Prøv igjen
          </Button>
        )}
      </HStack>
    </Container>
  );
};

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => (
  <HStack asChild style={{ gridArea: 'search' }} gap="space-16" justify="start" align="start" width="100%" wrap>
    <Box background="default" paddingInline="space-16" paddingBlock="space-16 space-8">
      {children}
    </Box>
  </HStack>
);
