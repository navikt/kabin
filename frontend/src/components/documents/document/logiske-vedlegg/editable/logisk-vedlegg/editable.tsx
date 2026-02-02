import { EditLogiskVedlegg } from '@app/components/documents/document/logiske-vedlegg/editable/logisk-vedlegg/edit';
import { ReadOnlyTag } from '@app/components/documents/document/logiske-vedlegg/shared/vedlegg-style';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useDeleteLogiskVedleggMutation, useUpdateLogiskVedleggMutation } from '@app/redux/api/logiske-vedlegg';
import type { LogiskVedlegg } from '@app/types/dokument';
import { FilesIcon, PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, HStack, Tooltip } from '@navikt/ds-react';
import { useCallback, useRef, useState } from 'react';

interface Props {
  dokumentInfoId: string;
  logiskVedlegg: LogiskVedlegg;
  logiskeVedlegg: LogiskVedlegg[];
  temaId: string | null;
}

export const EditableLogiskVedlegg = ({ dokumentInfoId, logiskVedlegg, logiskeVedlegg, temaId }: Props) => {
  const { sakenGjelderValue } = useRegistrering();
  const [update, { isLoading: isUpdating }] = useUpdateLogiskVedleggMutation({ fixedCacheKey: dokumentInfoId });
  const [remove, { isLoading: isRemoving }] = useDeleteLogiskVedleggMutation({ fixedCacheKey: dokumentInfoId });
  const [isEditing, setIsEditing] = useState(false);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const removeButtonRef = useRef<HTMLButtonElement>(null);
  const [isFocused, setIsFocused] = useState(getIsFocused(editButtonRef) || getIsFocused(removeButtonRef));

  const onEditClick = useCallback(() => {
    setIsEditing((e) => !e);
  }, []);

  const onClose = () => setIsEditing(false);

  const { logiskVedleggId } = logiskVedlegg;

  if (sakenGjelderValue === null) {
    return null;
  }

  if (isEditing) {
    return (
      <EditLogiskVedlegg
        initialValue={logiskVedlegg.tittel}
        logiskeVedlegg={logiskeVedlegg}
        onClose={onClose}
        onDone={(tittel) => update({ sakenGjelderValue, dokumentInfoId, logiskVedleggId, tittel })}
        onDelete={() => remove({ sakenGjelderValue, dokumentInfoId, logiskVedleggId })}
        isLoading={isUpdating}
        placeholder="Endre"
        temaId={temaId}
        closeOnDone
      />
    );
  }

  return (
    <ReadOnlyTag size="small" variant="neutral" title={logiskVedlegg.tittel} className="group min-w-22">
      <span
        className={`cursor-text truncate ${isFocused ? 'opacity-0' : 'opacity-100'} group-hover:opacity-0`}
        data-testid="logisk-vedlegg"
      >
        {logiskVedlegg.tittel}
      </span>
      <span
        className={`absolute right-20 left-2 cursor-text truncate ${isFocused ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`}
        aria-hidden
        role="presentation"
      >
        {logiskVedlegg.tittel}
      </span>
      <HStack
        position="absolute"
        right="space-8"
        wrap={false}
        className={`select-none ${isFocused ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`}
      >
        <Tooltip content="Kopier" placement="top">
          <CopyButton
            size="xsmall"
            data-color="neutral"
            copyText={logiskVedlegg.tittel}
            icon={<FilesIcon aria-hidden />}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </Tooltip>

        <Tooltip content="Endre" placement="top">
          <Button
            data-color="neutral"
            size="xsmall"
            variant="tertiary"
            onClick={onEditClick}
            icon={<PencilIcon aria-hidden />}
            loading={isUpdating}
            disabled={isRemoving}
            ref={editButtonRef}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </Tooltip>

        <Tooltip content="Slett" placement="top">
          <Button
            data-color="neutral"
            size="xsmall"
            variant="tertiary"
            onClick={() => remove({ sakenGjelderValue, dokumentInfoId, logiskVedleggId })}
            icon={<TrashIcon aria-hidden />}
            loading={isRemoving}
            ref={removeButtonRef}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </Tooltip>
      </HStack>
    </ReadOnlyTag>
  );
};

const getIsFocused = ({ current }: React.RefObject<HTMLElement | null>) =>
  current?.contains(document.activeElement) ?? false;
