import { ToggleItem } from '@app/components/toggle-item/toggle-item';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useIsAnkeSource, useIsUploadedDocuments, useIsUploadedDocumentsSource } from '@app/hooks/use-journalpost';
import { useRegistrering } from '@app/hooks/use-registrering';
import { FraJournalpostToggle } from '@app/pages/registrering/fra-journalpost-toggle';
import { useSetTypeMutation } from '@app/redux/api/registreringer/mutations';
import { isType, SaksTypeEnum } from '@app/types/common';
import { HStack, InlineMessage, Stack, ToggleGroup } from '@navikt/ds-react';
import { useCallback } from 'react';

export const TypeSelect = () => {
  const { id, typeId, journalpostId, uploadedDocuments } = useRegistrering();
  const [setType] = useSetTypeMutation({ fixedCacheKey: id });
  const canEdit = useCanEdit();
  const isUploadedDocuments = useIsUploadedDocuments();
  const isAnkeSource = useIsAnkeSource(); // `Source.ANKE` is always an anke - the API sets `typeId` when the source is selected.
  const isUploadedDocumentsSource = useIsUploadedDocumentsSource();

  const onChange = useCallback(
    (newTypeId: string) => {
      if (!isType(newTypeId)) {
        return;
      }

      setType({ id, typeId: newTypeId });
    },
    [id, setType],
  );

  const readOnly = !canEdit;

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
      <ToggleGroup
        onChange={onChange}
        value={typeId ?? 'none'}
        size="small"
        key={typeId === null ? 'none' : 'some'}
        data-color={readOnly || isAnkeSource ? 'neutral' : undefined}
      >
        {isUploadedDocumentsSource ? null : (
          <ToggleItem value={SaksTypeEnum.KLAGE} disabled={readOnly || isAnkeSource}>
            Klage
          </ToggleItem>
        )}

        <ToggleItem value={SaksTypeEnum.ANKE} disabled={readOnly || isAnkeSource}>
          Anke
        </ToggleItem>

        <ToggleItem value={SaksTypeEnum.OMGJØRINGSKRAV} disabled={readOnly || isAnkeSource}>
          Omgjøringskrav
        </ToggleItem>

        <ToggleItem value={SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK} disabled={readOnly || isAnkeSource}>
          Begjæring om gjenopptak
        </ToggleItem>
      </ToggleGroup>

      <FraJournalpostToggle />
    </HStack>
  );
};
