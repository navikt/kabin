import { Buildings3Icon, PersonIcon } from '@navikt/aksel-icons';
import { Label, Tag, Tooltip } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { CopyPartIdButton } from '@app/components/copy-button/copy-part-id';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { ReadAddress } from '@app/components/svarbrev/address/read-address';
import { PDF_ASPECT_RATIO, PDF_PARAMS } from '@app/components/toast/constants';
import { Recipient } from '@app/pages/create/app-context/types';
import { InfoItem } from '@app/pages/status/common-components';
import { StyledCard } from '@app/pages/status/styled-components';
import { KABAL_API_BASE_PATH } from '@app/simple-api-state/use-api';
import { IdType, UTSENDINGSKANAL, Utsendingskanal } from '@app/types/common';
import { HandlingEnum } from '@app/types/recipient';
import { SvarbrevStatus } from '@app/types/status';

interface Props {
  svarbrev: SvarbrevStatus;
  id: string;
}

export const Svarbrev = ({ svarbrev, id }: Props) => (
  <>
    <StyledCard title="Svarbrev" $gridArea="svarbrev-metadata" titleSize="medium">
      <InfoItem label="Dokumentnavn">{svarbrev.title}</InfoItem>
      <Section>
        <Label>Mottakere</Label>
        <StyledList>
          {svarbrev.receivers.map((recipient) => (
            <Part key={recipient.part.id} {...recipient} />
          ))}
        </StyledList>
      </Section>
    </StyledCard>
    <StyledCard title="Svarbrev" $gridArea="svarbrev-pdf" titleSize="medium">
      <StyledPdf
        data={`${KABAL_API_BASE_PATH}/behandlinger/${id}/dokumenter/${svarbrev.dokumentUnderArbeidId}/pdf${PDF_PARAMS}`}
        type="application/pdf"
      />
    </StyledCard>
  </>
);

const StyledList = styled.ul`
  padding: 0;
  margin: 0;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

const StyledPdf = styled.object`
  width: 100%;
  aspect-ratio: ${PDF_ASPECT_RATIO};
`;

const Part = ({ part, overriddenAddress, handling }: Recipient) => {
  const isPerson = part.type === IdType.FNR;

  return (
    <PartContent>
      <StyledName>
        <Tooltip content={isPerson ? 'Person' : 'Organisasjon'}>
          {isPerson ? <PersonIcon aria-hidden /> : <Buildings3Icon aria-hidden />}
        </Tooltip>
        {part.name} <CopyPartIdButton id={part.id} size="xsmall" />
      </StyledName>

      <StyledPartStatusList statusList={part.statusList} />

      <Channel>
        <Tooltip content="Utsendingskanal">
          <Tag size="small" variant="neutral">
            {getUtsendingskanal(handling, part.utsendingskanal)}
          </Tag>
        </Tooltip>
      </Channel>

      <ReadAddress address={part.address} overriddenAddress={overriddenAddress} part={part} />
    </PartContent>
  );
};

const getUtsendingskanal = (handling: HandlingEnum, defaultUtsendingskanal: Utsendingskanal) => {
  switch (handling) {
    case HandlingEnum.AUTO:
      return UTSENDINGSKANAL[defaultUtsendingskanal];
    case HandlingEnum.CENTRAL_PRINT:
      return UTSENDINGSKANAL[Utsendingskanal.SENTRAL_UTSKRIFT];
    case HandlingEnum.LOCAL_PRINT:
      return UTSENDINGSKANAL[Utsendingskanal.LOKAL_UTSKRIFT];
  }
};

const PartContent = styled.li`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: start;
  row-gap: 0;
  border: 1px solid var(--a-border-default);
  border-left-width: 4px;
  border-radius: var(--a-border-radius-medium);
  padding: 0;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 2px;
  width: 100%;
`;

const StyledName = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 8px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  min-height: 32px;
`;

const Channel = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 4px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
`;

const StyledPartStatusList = styled(PartStatusList)`
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
`;
