import { DocPencilIcon } from '@navikt/aksel-icons';
import { Label } from '@navikt/ds-react';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { Card } from '@app/components/card/card';
import { EditMottattVedtaksinstans } from '@app/components/overstyringer/edit-mottatt-vedtaksinstans';
import {
  AvsenderIcon,
  FullmektigIcon,
  KlagerIcon,
  SakenGjelderIcon,
  StyledAvsenderIcon,
  StyledFullmektigIcon,
  StyledKlagerIcon,
  StyledSakenGjelderIcon,
} from '@app/components/overstyringer/icons';
import { Klageoverstyringer } from '@app/components/overstyringer/klageoverstyringer';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { avsenderMottakerToPart } from '@app/domain/converters';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
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
          options={[
            {
              label: 'Avsender',
              defaultPart: payload === null ? null : avsenderMottakerToPart(payload.overstyringer.avsender),
              title: 'Avsender',
              icon: <AvsenderIcon aria-hidden />,
            },
          ]}
        />
        <Part
          gridArea={GridArea.AVSENDER}
          partField={FieldNames.AVSENDER}
          part={overstyringer.avsender}
          label="Avsender"
          icon={<StyledAvsenderIcon aria-hidden />}
          options={[
            {
              label: 'Saken gjelder',
              defaultPart: mulighet.sakenGjelder,
              title: 'Saken gjelder',
              icon: <SakenGjelderIcon aria-hidden />,
            },
            {
              label: getKlagerLabel(type),
              defaultPart: overstyringer.klager,
              title: getKlagerLabel(type),
              icon: <KlagerIcon aria-hidden />,
            },
            {
              label: 'Fullmektig',
              defaultPart: overstyringer.fullmektig,
              title: 'Fullmektig',
              icon: <FullmektigIcon aria-hidden />,
            },
          ]}
        />
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

const getKlagerLabel = (type: Type.ANKE | Type.KLAGE) => {
  switch (type) {
    case Type.ANKE:
      return 'Ankende part';
    case Type.KLAGE:
      return 'Klager';
  }
};
