import { CardLarge } from '@app/components/card/card';
import { Avsender } from '@app/components/overstyringer/avsender';
import { EditFrist } from '@app/components/overstyringer/edit-frist';
import { EditMottattKlageinstans } from '@app/components/overstyringer/edit-mottatt-klageinstans';
import { EditMottattVedtaksinstans } from '@app/components/overstyringer/edit-mottatt-vedtaksinstans';
import {
  AvsenderIcon,
  SakenGjelderIcon,
  StyledFullmektigIcon,
  StyledKlagerIcon,
  StyledSakenGjelderIcon,
} from '@app/components/overstyringer/icons';
import { Innsendingshjemler } from '@app/components/overstyringer/innsendingshjemler';
import { MottattDateError } from '@app/components/overstyringer/mottatt-date-error';
import { Part } from '@app/components/overstyringer/part';
import { SakenGjelder } from '@app/components/overstyringer/part-read/part-read';
import type { ISetPart } from '@app/components/overstyringer/part-read/types';
import { Tildeling } from '@app/components/overstyringer/tildeling/tildeling';
import { FieldNames } from '@app/components/overstyringer/types';
import { useSakenGjelderPart } from '@app/components/overstyringer/use-saken-gjelder-part';
import { Ytelse } from '@app/components/overstyringer/ytelse';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { avsenderIsPart, avsenderMottakerToPart } from '@app/domain/converters';
import { formatFoedselsnummer } from '@app/functions/format-id';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useYtelseId } from '@app/hooks/use-ytelse-id';
import { useGetPartWithUtsendingskanalQuery } from '@app/redux/api/part';
import type { SearchPartWithUtsendingskanalParams } from '@app/redux/api/registreringer/param-types';
import { type IPart, SaksTypeEnum } from '@app/types/common';
import { JournalposttypeEnum } from '@app/types/dokument';
import { ValidationFieldNames } from '@app/types/validation';
import { ArchiveIcon, DocPencilIcon, PersonGroupIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, HStack, Label, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { styled } from 'styled-components';

interface Props {
  title: string;
  klagerLabel: string;
  saksbehandlerFromMulighetLabel: string;
}

const useAvsenderMottakerParams = (): SearchPartWithUtsendingskanalParams | typeof skipToken => {
  const { journalpost } = useJournalpost();
  const { sakenGjelderValue, overstyringer } = useRegistrering();

  if (
    typeof journalpost?.avsenderMottaker?.id !== 'string' ||
    sakenGjelderValue === null ||
    overstyringer.ytelseId === null
  ) {
    return skipToken;
  }

  return {
    identifikator: journalpost.avsenderMottaker.id,
    sakenGjelderId: sakenGjelderValue,
    ytelseId: overstyringer.ytelseId,
  };
};

const Parts = ({ title, klagerLabel, saksbehandlerFromMulighetLabel }: Props) => {
  const { sakenGjelderValue, overstyringer } = useRegistrering();
  const { klager, fullmektig, avsender } = overstyringer;
  const { typeId, mulighet } = useMulighet();
  const { journalpost } = useJournalpost();
  const avsenderMottakerParams = useAvsenderMottakerParams();
  const { data: avsenderMottaker } = useGetPartWithUtsendingskanalQuery(avsenderMottakerParams);
  const { sakenGjelder, isLoading, error, refetch } = useSakenGjelderPart();

  const klagerError = useValidationError(ValidationFieldNames.KLAGER);
  const fullmektigError = useValidationError(ValidationFieldNames.FULLMEKTIG);

  if (isLoading) {
    return (
      <CardLarge title={title}>
        <Placeholder>
          <Loader size="3xlarge" aria-label="Laster..." />
        </Placeholder>
      </CardLarge>
    );
  }

  if (typeof error === 'string') {
    return (
      <CardLarge title={title}>
        <Alert variant="error" size="small">
          <BodyShort>{error}</BodyShort>
        </Alert>
      </CardLarge>
    );
  }

  if (sakenGjelder === null) {
    return (
      <CardLarge title={title}>
        <Alert variant="error" size="small">
          <BodyShort spacing>Kunne ikke hente saken gjelder ({formatFoedselsnummer(sakenGjelderValue)}).</BodyShort>
          <HStack gap="space-8" align="center" asChild>
            <BodyShort>
              <Button variant="primary" size="small" onClick={refetch} loading={isLoading}>
                Prøv igjen
              </Button>
              eller ta kontakt med Team Klage på Teams.
            </BodyShort>
          </HStack>
        </Alert>
      </CardLarge>
    );
  }

  const sakenGjelderOption: ISetPart<IPart> = {
    label: 'Saken gjelder',
    defaultPart: sakenGjelder,
    title: 'Saken gjelder',
    icon: <SakenGjelderIcon aria-hidden />,
  };

  const klagerOption: ISetPart<IPart | null> = {
    label: klagerLabel,
    defaultPart: klager,
    title: klagerLabel,
    icon: <StyledKlagerIcon aria-hidden />,
  };

  const fullmektigOption: ISetPart<IPart | null> = {
    label: 'Fullmektig',
    defaultPart: fullmektig,
    title: 'Fullmektig',
    icon: <StyledFullmektigIcon aria-hidden />,
  };

  const mulighetFullmektig: ISetPart<IPart> | null =
    typeId === SaksTypeEnum.ANKE && mulighet?.fullmektig !== undefined && mulighet?.fullmektig !== null
      ? {
          label: 'Fullmektig fra mulighet',
          defaultPart: mulighet.fullmektig,
          title: 'Fullmektig fra mulighet',
          icon: <StyledFullmektigIcon aria-hidden />,
        }
      : null;

  const avsenderOption: ISetPart<IPart | null> = {
    label: 'Avsender',
    defaultPart: avsenderMottakerToPart(avsender),
    title: 'Avsender',
    icon: <AvsenderIcon aria-hidden />,
  };

  const journalpostAvsenderOption: ISetPart<IPart | null> | null =
    journalpost?.avsenderMottaker?.id === avsender?.identifikator
      ? null
      : {
          label: 'Journalpostavsender',
          defaultPart:
            journalpost !== undefined &&
            journalpost.journalposttype === JournalposttypeEnum.INNGAAENDE &&
            journalpost.avsenderMottaker !== null &&
            avsenderIsPart(journalpost.avsenderMottaker)
              ? (avsenderMottaker ?? null)
              : null,
          title: 'Journalpostavsender',
          icon: <ArchiveIcon aria-hidden />,
        };

  const options: ISetPart[] = [
    sakenGjelderOption,
    klagerOption,
    fullmektigOption,
    mulighetFullmektig,
    avsenderOption,
    journalpostAvsenderOption,
  ].filter((o): o is ISetPart => o !== null && o.defaultPart !== null);

  return (
    <>
      <Label size="small">Parter</Label>
      <Content>
        <SakenGjelder part={sakenGjelder} label="Saken gjelder" icon={<StyledSakenGjelderIcon aria-hidden />} />

        <Part
          partField={FieldNames.KLAGER}
          part={klager}
          label={klagerLabel}
          icon={<StyledKlagerIcon aria-hidden />}
          error={klagerError}
          options={options}
        />

        <Part
          partField={FieldNames.FULLMEKTIG}
          part={fullmektig}
          label="Fullmektig"
          icon={<StyledFullmektigIcon aria-hidden />}
          optional
          error={fullmektigError}
          excludedPartIds={[sakenGjelderValue]}
          options={options}
        />

        <Avsender options={options} />

        <Tildeling saksbehandlerFromMulighetLabel={saksbehandlerFromMulighetLabel} />
      </Content>
    </>
  );
};

export const Overstyringer = ({ title, ...props }: Props) => {
  const { mulighet } = useRegistrering();
  const ytelseId = useYtelseId();

  if (typeof mulighet?.id !== 'string') {
    return (
      <CardLarge title={title}>
        <Placeholder>
          <DocPencilIcon aria-hidden />
        </Placeholder>
      </CardLarge>
    );
  }

  return (
    <CardLarge title={title}>
      <Header>
        <TopRow>
          <EditMottattVedtaksinstans />
          <EditMottattKlageinstans />
          <EditFrist />
        </TopRow>
        <MottattDateError />
      </Header>
      <Content>
        <Ytelse />
        <Innsendingshjemler />
      </Content>
      {ytelseId === null ? (
        <Placeholder>
          <PersonGroupIcon aria-hidden />
        </Placeholder>
      ) : (
        <Parts title={title} {...props} />
      )}
    </CardLarge>
  );
};

const Header = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
`;

const TopRow = styled.div`
  display: flex;
  column-gap: 16px;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;
