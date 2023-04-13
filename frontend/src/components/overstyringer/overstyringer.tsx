import { DocPencilIcon } from '@navikt/aksel-icons';
import { Label } from '@navikt/ds-react';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { Card } from '@app/components/card/card';
import { Avsender } from '@app/components/overstyringer/avsender';
import { StyledFullmektigIcon, StyledKlagerIcon, StyledSakenGjelderIcon } from '@app/components/overstyringer/icons';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { EditFrist } from './edit-frist';
import { EditMottattNAV } from './edit-mottatt-nav';
import { Part } from './part';
import { PartRead } from './part-read';
import { FieldNames, GridArea } from './types';

interface Props {
  title: string;
  klagerLabel: string;
}

export const Overstyringer = ({ title, klagerLabel }: Props) => {
  const { type, payload, updatePayload } = useContext(ApiContext);

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
        <EditMottattNAV />
        <EditFrist />
        <StyledHeading size="small">Parter</StyledHeading>
        <PartRead
          gridArea={GridArea.SAKEN_GJELDER}
          partField={FieldNames.SAKEN_GJELDER}
          part={mulighet.sakenGjelder}
          label="Saken gjelder"
          icon={<StyledSakenGjelderIcon aria-hidden />}
        />
        <Part
          gridArea={GridArea.ANKER}
          partField={FieldNames.KLAGER}
          part={overstyringer.klager}
          setPart={(klager) => updatePayload({ overstyringer: { klager } })}
          label={klagerLabel}
          icon={<StyledKlagerIcon aria-hidden />}
        />
        <Part
          gridArea={GridArea.FULLMEKTIG}
          partField={FieldNames.FULLMEKTIG}
          part={overstyringer.fullmektig}
          setPart={(fullmektig) => updatePayload({ overstyringer: { fullmektig } })}
          label="Fullmektig"
          icon={<StyledFullmektigIcon aria-hidden />}
        />
        <Avsender />
      </Content>
    </Card>
  );
};

const Content = styled.div`
  display: grid;
  grid-template-areas: 'mottattnav frist' 'title title' '${GridArea.SAKEN_GJELDER} ${GridArea.ANKER}' '${GridArea.FULLMEKTIG} ${GridArea.AVSENDER}';
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 16px;
`;

const StyledHeading = styled(Label)`
  grid-area: title;
`;
