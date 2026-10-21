import { ToggleItem } from '@app/components/toggle-item/toggle-item';
import { useSakstypeName } from '@app/hooks/kodeverk';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useIsAnkeSource, useIsUploadedDocuments, useIsUploadedDocumentsSource } from '@app/hooks/use-journalpost';
import { useRegistrering } from '@app/hooks/use-registrering';
import { FraJournalpostToggle } from '@app/pages/registrering/fra-journalpost-toggle';
import { useSetTypeMutation } from '@app/redux/api/registreringer/mutations';
import { isType, SaksTypeEnum } from '@app/types/common';
import { HStack, InlineMessage, Stack, ToggleGroup } from '@navikt/ds-react';

export const TypeSelect = () => {
  const { id, typeId, journalpostId, uploadedDocuments } = useRegistrering();
  const [setType] = useSetTypeMutation({ fixedCacheKey: id });
  const canEdit = useCanEdit();
  const isUploadedDocuments = useIsUploadedDocuments();

  const readOnly = !canEdit;
  const toggleGroupItems = useToggleGroupItems(readOnly);

  const onChange = (newTypeId: string) => {
    if (!isType(newTypeId)) {
      return;
    }

    setType({ id, typeId: newTypeId });
  };

  if (!readOnly && (isUploadedDocuments ? uploadedDocuments.dokumenter.length === 0 : journalpostId === null)) {
    return (
      <Stack justify="center" marginBlock="space-4">
        <InlineMessage status="info" size="small">
          {isUploadedDocuments ? 'Last opp dokument' : 'Velg journalpost'} for å velge sakstype.
        </InlineMessage>
      </Stack>
    );
  }

  // Without `key` TogglegGroup will remember last non-undefined value when undefined.
  return (
    <HStack justify="center" align="center" gap="space-16">
      <ToggleGroup onChange={onChange} value={typeId ?? 'none'} size="small" key={typeId === null ? 'none' : 'some'}>
        {toggleGroupItems}
      </ToggleGroup>

      <FraJournalpostToggle />
    </HStack>
  );
};

const useToggleGroupItems = (disabled: boolean) => {
  const isSakFraTr = useIsAnkeSource();
  const isUploadedDocumentsSource = useIsUploadedDocumentsSource();

  if (isSakFraTr) {
    return (
      <>
        <ToggleGroupItem value={SaksTypeEnum.ANKE_AFTER_2027} disabled={disabled} />
        <ToggleGroupItem value={SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_AFTER_2027} disabled={disabled} />
      </>
    );
  }

  return (
    <>
      {isUploadedDocumentsSource ? null : <ToggleGroupItem value={SaksTypeEnum.KLAGE} disabled={disabled} />}
      <ToggleGroupItem value={SaksTypeEnum.ANKE} disabled={disabled} />
      <ToggleGroupItem value={SaksTypeEnum.OMGJØRINGSKRAV} disabled={disabled} />
      <ToggleGroupItem value={SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK} disabled={disabled} />
    </>
  );
};

const ToggleGroupItem = ({ value, disabled }: { value: SaksTypeEnum; disabled: boolean }) => {
  const name = useSakstypeName(value);

  return (
    <ToggleItem value={value} disabled={disabled}>
      {name}
    </ToggleItem>
  );
};
