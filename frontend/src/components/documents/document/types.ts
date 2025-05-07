import type { IArkivertDocument } from '@app/types/dokument';

type CreateOnMouseDown = (journalpostId: string) => (e: React.MouseEvent) => void;

/**
 * A tuple containing a function to create an onMouseDown event handler and a loading state for the invoked function.
 */
export type SelectJournalpost = [CreateOnMouseDown, boolean];

/**
 * A tuple containing a boolean indicating if the document can be selected and an reason string if it cannot.
 */
export type CanBeSelected = [true, undefined] | [false, string];

export interface BaseSelectDocumentProps {
  selectJournalpost: SelectJournalpost;
  getIsSelected: (journalpostId: string) => boolean;
  getCanBeSelected: (document: IArkivertDocument) => CanBeSelected;
}
