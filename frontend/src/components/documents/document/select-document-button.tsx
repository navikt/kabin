import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';
import type { CanBeSelected, SelectJournalpost } from '@app/components/documents/document/types';
import { GridArea, GridButton } from '@app/components/documents/styled-grid-components';
import { useCanEdit } from '@app/hooks/use-can-edit';
import type { IArkivertDocument } from '@app/types/dokument';
import { CircleSlashIcon } from '@navikt/aksel-icons';

interface Props {
  selectJournalpost: SelectJournalpost;
  getCanBeSelected: (d: IArkivertDocument) => CanBeSelected;
  isSelected: boolean;
  dokument: IArkivertDocument;
}

export const SelectDocumentButton = ({ isSelected, dokument, selectJournalpost, getCanBeSelected }: Props) => {
  const canEdit = useCanEdit();
  const canBeSelected = getCanBeSelected(dokument);
  const [enabled] = canBeSelected;

  if (!canEdit) {
    return isSelected ? (
      <CheckmarkCircleFillIconColored
        aria-label="Valgt"
        fontSize={20}
        className="self-center justify-self-center"
        style={{ gridArea: GridArea.SELECT }}
      />
    ) : null;
  }

  const [createOnMouseDown, isLoading] = selectJournalpost;

  return (
    <GridButton
      disabled={!enabled}
      size="small"
      variant="tertiary-neutral"
      icon={getIcon(enabled, isSelected)}
      onMouseDown={createOnMouseDown(dokument.journalpostId)}
      aria-pressed={isSelected}
      data-testid="select-document"
      gridArea={GridArea.SELECT}
      loading={isLoading && isSelected} // Works beause isSelected will be set optimistically
      title={getTitle(isSelected, canBeSelected)}
    >
      {!enabled || isSelected ? null : 'Velg'}
    </GridButton>
  );
};

const getTitle = (isSelected: boolean, [canBeSelected, reason]: CanBeSelected) => {
  if (isSelected) {
    return 'Valgt';
  }

  if (!canBeSelected) {
    return reason;
  }

  return 'Velg';
};

const getIcon = (enabled: boolean, isSelected: boolean) => {
  if (!enabled) {
    return <CircleSlashIcon aria-hidden role="presentation" />;
  }

  if (isSelected) {
    return <CheckmarkCircleFillIconColored />;
  }

  return undefined;
};
