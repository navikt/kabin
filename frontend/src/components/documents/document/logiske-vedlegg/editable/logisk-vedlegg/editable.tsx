import { EditLogiskVedlegg } from '@app/components/documents/document/logiske-vedlegg/editable/logisk-vedlegg/edit';
import { ReadOnlyTag } from '@app/components/documents/document/logiske-vedlegg/shared/vedlegg-style';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useDeleteLogiskVedleggMutation, useUpdateLogiskVedleggMutation } from '@app/redux/api/logiske-vedlegg';
import type { LogiskVedlegg } from '@app/types/dokument';
import { FilesIcon, PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, Tooltip } from '@navikt/ds-react';
import { useCallback, useRef, useState } from 'react';
import { styled } from 'styled-components';

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
    <EditableTag size="small" variant="neutral" title={logiskVedlegg.tittel}>
      <Title $isFocused={isFocused} data-testid="logisk-vedlegg">
        {logiskVedlegg.tittel}
      </Title>

      <AbsoluteTitle $isFocused={isFocused} aria-hidden role="presentation">
        {logiskVedlegg.tittel}
      </AbsoluteTitle>

      <ButtonContainer $isFocused={isFocused}>
        <Tooltip content="Kopier" placement="top">
          <CopyButton
            size="xsmall"
            variant="neutral"
            copyText={logiskVedlegg.tittel}
            icon={<FilesIcon aria-hidden />}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </Tooltip>

        <Tooltip content="Endre" placement="top">
          <Button
            size="xsmall"
            variant="tertiary-neutral"
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
            size="xsmall"
            variant="tertiary-neutral"
            onClick={() => remove({ sakenGjelderValue, dokumentInfoId, logiskVedleggId })}
            icon={<TrashIcon aria-hidden />}
            loading={isRemoving}
            ref={removeButtonRef}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </Tooltip>
      </ButtonContainer>
    </EditableTag>
  );
};

const getIsFocused = ({ current }: React.RefObject<HTMLElement | null>) =>
  current?.contains(document.activeElement) ?? false;

interface StyleProps {
  $isFocused: boolean;
}

const Title = styled.span<StyleProps>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: ${({ $isFocused }) => ($isFocused ? 0 : 1)};
  cursor: text;
`;

const AbsoluteTitle = styled.span<StyleProps>`
  position: absolute;
  left: 8px;
  right: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: ${({ $isFocused }) => ($isFocused ? 1 : 0)};
  cursor: text;
`;

const ButtonContainer = styled.div<StyleProps>`
  display: flex;
  flex-direction: row;
  column-gap: 0;
  opacity: ${({ $isFocused }) => ($isFocused ? 1 : 0)};
  position: absolute;
  right: 8px;
  user-select: none;
`;

const EditableTag = styled(ReadOnlyTag)`
  min-width: 88px;

  &:hover {
    ${Title} {
      opacity: 0;
    }

    ${AbsoluteTitle}, ${ButtonContainer} {
      opacity: 1;
    }
  }
`;
