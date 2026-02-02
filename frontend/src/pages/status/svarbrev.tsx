import { AppTheme, useAppTheme } from '@app/app-theme';
import { CopyPartIdButton } from '@app/components/copy-button/copy-part-id';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { ReadAddress } from '@app/components/svarbrev/address/read-address';
import { PDF_ASPECT_RATIO, PDF_PARAMS } from '@app/components/svarbrev/preview/constants';
import { InfoItem } from '@app/pages/status/common-components';
import { StyledCard } from '@app/pages/status/layout';
import { KABAL_API_BASE_PATH } from '@app/redux/api/common';
import type { Receiver } from '@app/redux/api/registreringer/types';
import { IdType, UTSENDINGSKANAL, Utsendingskanal } from '@app/types/common';
import { HandlingEnum } from '@app/types/receiver';
import type { SvarbrevStatus } from '@app/types/status';
import { Buildings3Icon, PersonIcon } from '@navikt/aksel-icons';
import { Box, HStack, Label, Tag, Tooltip, VStack } from '@navikt/ds-react';

interface Props {
  svarbrev: SvarbrevStatus;
  id: string;
}

export const Svarbrev = ({ svarbrev, id }: Props) => {
  const appTheme = useAppTheme();

  return (
    <>
      <StyledCard title="Svarbrevinfo" gridArea="svarbrev-metadata" titleSize="medium">
        <InfoItem label="Dokumentnavn">{svarbrev.title}</InfoItem>
        <VStack gap="space-2" as="section" width="100%" aria-labelledby="svarbrevinfo-mottakere">
          <Label id="svarbrevinfo-mottakere">Mottakere</Label>
          <VStack gap="space-8" as="ul" margin="space-0" padding="space-0" className="list-none">
            {svarbrev.receivers.map((receiver) => (
              <Part key={receiver.part.identifikator} {...receiver} />
            ))}
          </VStack>
        </VStack>
      </StyledCard>
      <StyledCard title="Svarbrev" gridArea="svarbrev-pdf" titleSize="medium">
        <object
          className="w-full"
          style={{
            aspectRatio: PDF_ASPECT_RATIO,
            filter: appTheme === AppTheme.DARK ? 'hue-rotate(180deg) invert(1)' : 'none',
          }}
          data={`${KABAL_API_BASE_PATH}/behandlinger/${id}/dokumenter/mergedocuments/${svarbrev.dokumentUnderArbeidId}/pdf${PDF_PARAMS}`}
          type="application/pdf"
          aria-label={svarbrev.title}
        />
      </StyledCard>
    </>
  );
};

const Part = ({ part, overriddenAddress, handling }: Receiver) => {
  const isPerson = part.type === IdType.FNR;

  return (
    <Box asChild borderRadius="4" borderColor="neutral" borderWidth="1 1 1 4" padding="space-0">
      <VStack as="li" align="stretch" justify="start" gap="space-0" aria-label={part.name ?? part.identifikator}>
        <HStack align="center" gap="space-8" minHeight="2rem" paddingInline="space-8" paddingBlock="space-4">
          <Tooltip content={isPerson ? 'Person' : 'Organisasjon'}>
            {isPerson ? <PersonIcon aria-hidden /> : <Buildings3Icon aria-hidden />}
          </Tooltip>
          {part.name} <CopyPartIdButton id={part.identifikator} size="xsmall" />
        </HStack>
        <Box paddingInline="space-8" paddingBlock="space-4">
          <PartStatusList statusList={part.statusList} />
        </Box>
        <HStack align="center" gap="space-4" as="section" paddingInline="space-8" paddingBlock="space-4">
          <Tooltip content="Utsendingskanal">
            <Tag data-color="neutral" size="small" variant="outline">
              {getUtsendingskanal(handling, part.utsendingskanal)}
            </Tag>
          </Tooltip>
        </HStack>
        <ReadAddress address={part.address} overriddenAddress={overriddenAddress} part={part} />
      </VStack>
    </Box>
  );
};

const getUtsendingskanal = (handling: HandlingEnum | null, defaultUtsendingskanal: Utsendingskanal) => {
  switch (handling) {
    case HandlingEnum.AUTO:
      return UTSENDINGSKANAL[defaultUtsendingskanal];
    case HandlingEnum.CENTRAL_PRINT:
      return UTSENDINGSKANAL[Utsendingskanal.SENTRAL_UTSKRIFT];
    case HandlingEnum.LOCAL_PRINT:
      return UTSENDINGSKANAL[Utsendingskanal.LOKAL_UTSKRIFT];
    case null:
      return 'Ikke tilgjengelig';
  }
};
