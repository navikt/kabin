import { DocPencilIcon } from '@navikt/aksel-icons';
import { Label } from '@navikt/ds-react';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { Card } from '@app/components/card/card';
import { Avsender } from '@app/components/overstyringer/avsender';
import { EditMottattVedtaksinstans } from '@app/components/overstyringer/edit-mottatt-vedtaksinstans';
import {
  AvsenderIcon,
  SakenGjelderIcon,
  StyledFullmektigIcon,
  StyledKlagerIcon,
  StyledSakenGjelderIcon,
} from '@app/components/overstyringer/icons';
import { Klageoverstyringer } from '@app/components/overstyringer/klageoverstyringer';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { avsenderMottakerToPart } from '@app/domain/converters';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { ValidationFieldNames } from '@app/types/validation';
import { EditFrist } from './edit-frist';
import { EditMottattKlageinstans } from './edit-mottatt-klageinstans';
import { Part } from './part';
import { PartRead } from './part-read/part-read';
import { FieldNames, GridArea } from './types';

interface Props {
  title: string;
  klagerLabel: string;
}

export const Overstyringer = ({ title, klagerLabel }: Props) => {
  const { type, payload } = useContext(ApiContext);

  const klagerError = useValidationError(ValidationFieldNames.KLAGER);
  const fullmektigError = useValidationError(ValidationFieldNames.FULLMEKTIG);

  if (type === Type.NONE || payload.mulighet === null) {
    return (
      <Card title={title}>
        <Placeholder>
          <DocPencilIcon aria-hidden />
        </Placeholder>
      </Card>
    );
  }

  const { overstyringer, mulighet } = payload;

  return (
    <Card title={title}>
      <Content>
        <TopRow>
          <EditMottattVedtaksinstans />
          <EditMottattKlageinstans />
          <EditFrist />
        </TopRow>
        <StyledHeading size="small">Parter</StyledHeading>
        <PartRead
          gridArea={GridArea.SAKEN_GJELDER}
          partField={FieldNames.SAKEN_GJELDER}
          part={mulighet.sakenGjelder}
          label="Saken gjelder"
          icon={<StyledSakenGjelderIcon aria-hidden />}
        />
        <Part
          gridArea={GridArea.KLAGER}
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
          gridArea={GridArea.FULLMEKTIG}
          partField={FieldNames.FULLMEKTIG}
          part={overstyringer.fullmektig}
          label="Fullmektig"
          icon={<StyledFullmektigIcon aria-hidden />}
          required={false}
          error={fullmektigError}
          options={[
            {
              label: 'Avsender',
              defaultPart: payload === null ? null : avsenderMottakerToPart(payload.overstyringer.avsender),
              title: 'Avsender',
              icon: <AvsenderIcon aria-hidden />,
            },
          ]}
        />
        <Avsender />
        <Klageoverstyringer />
      </Content>
    </Card>
  );
};

const TopRow = styled.div`
  display: grid;
  column-gap: 8px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-area: toprow;
`;

const Content = styled.div`
  display: grid;
  grid-template-areas:
    'toprow toprow'
    'title title'
    '${GridArea.SAKEN_GJELDER} ${GridArea.KLAGER}'
    '${GridArea.FULLMEKTIG} ${GridArea.AVSENDER}'
    'ytelse hjemler';
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto auto;
  gap: 8px;
`;

const StyledHeading = styled(Label)`
  grid-area: title;
`;
