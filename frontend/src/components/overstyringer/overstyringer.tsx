import { DocPencilIcon, PersonGroupIcon } from '@navikt/aksel-icons';
import { Label } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { CardLarge } from '@app/components/card/card';
import { Avsender } from '@app/components/overstyringer/avsender';
import { EditFrist } from '@app/components/overstyringer/edit-frist';
import { EditMottattVedtaksinstans } from '@app/components/overstyringer/edit-mottatt-vedtaksinstans';
import {
  AvsenderIcon,
  SakenGjelderIcon,
  StyledFullmektigIcon,
  StyledKlagerIcon,
  StyledSakenGjelderIcon,
} from '@app/components/overstyringer/icons';
import { Innsendingshjemler } from '@app/components/overstyringer/innsendingshjemler';
import { Tildeling } from '@app/components/overstyringer/tildeling';
import { Ytelse } from '@app/components/overstyringer/ytelse';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { avsenderMottakerToPart } from '@app/domain/converters';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useYtelseId } from '@app/hooks/use-ytelse-id';
import { ValidationFieldNames } from '@app/types/validation';
import { EditMottattKlageinstans } from './edit-mottatt-klageinstans';
import { Part } from './part';
import { SakenGjelder } from './part-read/part-read';
import { FieldNames } from './types';

interface Props {
  title: string;
  klagerLabel: string;
}

export const Overstyringer = ({ title, klagerLabel }: Props) => {
  const { overstyringer } = useRegistrering();
  const { klager, fullmektig, avsender } = overstyringer;
  const { typeId, mulighet } = useMulighet();
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

  return (
    <CardLarge title={title}>
      <Header>
        <TopRow>
          <EditMottattVedtaksinstans />
          <EditMottattKlageinstans />
          <EditFrist />
        </TopRow>
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
              options={[
                {
                  label: 'Saken gjelder',
                  defaultPart: mulighet.sakenGjelder,
                  title: 'Saken gjelder',
                  icon: <SakenGjelderIcon aria-hidden />,
                },
              ]}
            />
            <Part
              partField={FieldNames.FULLMEKTIG}
              part={fullmektig}
              label="Fullmektig"
              icon={<StyledFullmektigIcon aria-hidden />}
              required={false}
              error={fullmektigError}
              options={[
                {
                  label: 'Avsender',
                  defaultPart: avsenderMottakerToPart(avsender),
                  title: 'Avsender',
                  icon: <AvsenderIcon aria-hidden />,
                },
              ]}
            />

            <Avsender />

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
