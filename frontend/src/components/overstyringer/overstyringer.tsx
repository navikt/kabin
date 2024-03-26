import { DocPencilIcon } from '@navikt/aksel-icons';
import { Label } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { CardLarge } from '@app/components/card/card';
import { Avsender } from '@app/components/overstyringer/avsender';
import { EditMottattVedtaksinstans } from '@app/components/overstyringer/edit-mottatt-vedtaksinstans';
import {
  AvsenderIcon,
  SakenGjelderIcon,
  StyledFullmektigIcon,
  StyledKlagerIcon,
  StyledSakenGjelderIcon,
} from '@app/components/overstyringer/icons';
import { Innsendingshjemmel } from '@app/components/overstyringer/innsendingshjemmel';
import { Tildeling } from '@app/components/overstyringer/tildeling';
import { Ytelse } from '@app/components/overstyringer/ytelse';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { avsenderMottakerToPart } from '@app/domain/converters';
import { useValidationError } from '@app/hooks/use-validation-error';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';
import { ValidationFieldNames } from '@app/types/validation';
import { EditFrist } from './edit-frist';
import { EditMottattKlageinstans } from './edit-mottatt-klageinstans';
import { Part } from './part';
import { PartRead } from './part-read/part-read';
import { FieldNames } from './types';

interface Props {
  title: string;
  klagerLabel: string;
}

export const Overstyringer = ({ title, klagerLabel }: Props) => {
  const { type, state } = useContext(AppContext);

  const klagerError = useValidationError(ValidationFieldNames.KLAGER);
  const fullmektigError = useValidationError(ValidationFieldNames.FULLMEKTIG);

  if (type === Type.NONE || state.mulighet === null) {
    return (
      <CardLarge title={title}>
        <Placeholder>
          <DocPencilIcon aria-hidden />
        </Placeholder>
      </CardLarge>
    );
  }

  const { overstyringer, mulighet } = state;

  return (
    <CardLarge title={title}>
      <Header>
        <TopRow>
          <EditMottattVedtaksinstans />
          <EditMottattKlageinstans />
          <EditFrist />
        </TopRow>
      </Header>
      <Label size="small">Parter</Label>
      <Content>
        <PartRead
          partField={FieldNames.SAKEN_GJELDER}
          part={mulighet.sakenGjelder}
          label="Saken gjelder"
          icon={<StyledSakenGjelderIcon aria-hidden />}
        />
        <Part
          partField={FieldNames.KLAGER}
          part={overstyringer.klager}
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
          part={overstyringer.fullmektig}
          label="Fullmektig"
          icon={<StyledFullmektigIcon aria-hidden />}
          required={false}
          error={fullmektigError}
          options={[
            {
              label: 'Avsender',
              defaultPart: state === null ? null : avsenderMottakerToPart(state.overstyringer.avsender),
              title: 'Avsender',
              icon: <AvsenderIcon aria-hidden />,
            },
          ]}
        />
        <Avsender />
        <Ytelse />
        <Innsendingshjemmel />
        <Tildeling />
      </Content>
    </CardLarge>
  );
};

const Header = styled.div`
  display: flex;
  flex-direction: column;
`;

const TopRow = styled.div`
  display: grid;
  column-gap: 8px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;
