import { CopyPartIdButton, StyledCopyButton } from '@app/components/copy-button/copy-part-id';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { useFagsystemName } from '@app/hooks/kodeverk';
import { StyledPart } from '@app/pages/status/layout';
import type { IPart, ISaksbehandler } from '@app/types/common';
import type { IJournalpostAvsenderMottaker, ISak } from '@app/types/dokument';
import { BodyShort, HStack, Label, VStack } from '@navikt/ds-react';

interface InfoProps {
  label: string;
  children: React.ReactNode;
}

export const InfoItem = ({ label, children }: InfoProps) => (
  <VStack gap="space-2" width="100%" asChild>
    <Label>
      {label}

      {typeof children === 'string' ? <BodyShort>{children}</BodyShort> : children}
    </Label>
  </VStack>
);

export const Time = ({ dateTime, children }: TimeProps) => (
  <BodyShort>
    <time dateTime={dateTime}>{children}</time>
  </BodyShort>
);

interface TimeProps {
  dateTime: string;
  children: string;
}

interface SakProps {
  sak: Omit<ISak, 'datoOpprettet' | 'fagsaksystem'> | null;
}

export const Sak = ({ sak }: SakProps) => {
  const fagsystemName = useFagsystemName(sak?.fagsystemId);

  return (
    <HStack gap="space-16">
      <InfoItem label="Fagsystem">{sak === null ? 'Ingen' : fagsystemName}</InfoItem>
      <InfoItem label="Saks-ID">
        {sak === null ? 'Ingen' : <StyledCopyButton copyText={sak.fagsakId} text={sak.fagsakId} size="xsmall" />}
      </InfoItem>
    </HStack>
  );
};

const NoPart = ({ title }: { title: string }) => (
  <InfoItem label={title}>
    <BodyShort>Ingen</BodyShort>
  </InfoItem>
);

const PartInfo = ({ name, id }: { name: string | null; id: string }) => (
  <StyledPart>
    <span>{name ?? 'Navn mangler'}</span>
    <CopyPartIdButton id={id} size="xsmall" />
  </StyledPart>
);

interface PartProps {
  title: string;
  part: IPart | null;
}

export const Part = ({ part, title }: PartProps) =>
  part === null ? (
    <NoPart title={title} />
  ) : (
    <InfoItem label={title}>
      <PartInfo name={part.name} id={part.identifikator} />
      <PartStatusList statusList={part.statusList} />
    </InfoItem>
  );

interface AvsenderMottakerProps {
  avsenderMottaker: IJournalpostAvsenderMottaker | null;
}

export const AvsenderMottaker = ({ avsenderMottaker }: AvsenderMottakerProps) =>
  avsenderMottaker === null ? (
    <NoPart title="Avsender/mottaker" />
  ) : (
    <InfoItem label="Avsender/mottaker">
      <PartInfo name={avsenderMottaker.name} id={avsenderMottaker.id} />
    </InfoItem>
  );

interface NavEmployeeProps {
  title: string;
  employee: ISaksbehandler | null;
}

export const NavEmployee = ({ title, employee }: NavEmployeeProps) => (
  <InfoItem label={title}>
    {employee === null ? (
      <BodyShort>Ingen</BodyShort>
    ) : (
      <StyledPart>
        <span>
          {employee.navn} ({employee.navIdent})
        </span>
        <CopyPartIdButton id={employee.navIdent} size="xsmall" />
      </StyledPart>
    )}
  </InfoItem>
);
