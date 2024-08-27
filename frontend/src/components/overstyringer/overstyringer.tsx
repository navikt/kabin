import { ArchiveIcon, DocPencilIcon, PersonGroupIcon } from '@navikt/aksel-icons';
import { Label } from '@navikt/ds-react';
import { styled } from 'styled-components';
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
import { ISetPart } from '@app/components/overstyringer/part-read/types';
import { Tildeling } from '@app/components/overstyringer/tildeling/tildeling';
import { FieldNames } from '@app/components/overstyringer/types';
import { Ytelse } from '@app/components/overstyringer/ytelse';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { avsenderIsPart, avsenderMottakerToPart } from '@app/domain/converters';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useYtelseId } from '@app/hooks/use-ytelse-id';
import { IPart, SaksTypeEnum } from '@app/types/common';
import { JournalposttypeEnum } from '@app/types/dokument';
import { ValidationFieldNames } from '@app/types/validation';

interface Props {
  title: string;
  klagerLabel: string;
}

export const Overstyringer = ({ title, klagerLabel }: Props) => {
  const { sakenGjelderValue, overstyringer } = useRegistrering();
  const { klager, fullmektig, avsender } = overstyringer;
  const { typeId, mulighet } = useMulighet();
  const { journalpost } = useJournalpost();
  const ytelseId = useYtelseId();

  const klagerError = useValidationError(ValidationFieldNames.KLAGER);
  const fullmektigError = useValidationError(ValidationFieldNames.FULLMEKTIG);

  if (typeId === null || mulighet === undefined) {
    return (
      <CardLarge title={title}>
        <Placeholder>
          <DocPencilIcon aria-hidden />
        </Placeholder>
      </CardLarge>
    );
  }

  const sakenGjelderOption: ISetPart<IPart> = {
    label: 'Saken gjelder',
    defaultPart: mulighet.sakenGjelder,
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
    typeId === SaksTypeEnum.ANKE && mulighet.fullmektig !== null
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
    journalpost?.avsenderMottaker?.id === avsender?.id
      ? null
      : {
          label: 'Journalpostavsender',
          defaultPart:
            journalpost !== undefined &&
            journalpost.journalposttype === JournalposttypeEnum.INNGAAENDE &&
            journalpost.avsenderMottaker !== null &&
            avsenderIsPart(journalpost.avsenderMottaker)
              ? avsenderMottakerToPart(journalpost.avsenderMottaker)
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
        <>
          <Label size="small">Parter</Label>
          <Content>
            <SakenGjelder
              part={mulighet.sakenGjelder}
              label="Saken gjelder"
              icon={<StyledSakenGjelderIcon aria-hidden />}
            />

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

            <Tildeling />
          </Content>
        </>
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
