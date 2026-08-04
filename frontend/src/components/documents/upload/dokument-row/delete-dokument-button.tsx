import { DocumentViewerContext, isViewedUploadedDokument } from '@app/pages/registrering/document-viewer-context';
import { useDeleteDokumentMutation } from '@app/redux/api/registreringer/documents';
import { XMarkIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import { useContext } from 'react';

interface Props {
  registreringId: string;
  dokumentId: string;
  abortUpload: (dokumentId: string) => void;
}

export const DeleteDokumentButton = ({ registreringId, dokumentId, abortUpload }: Props) => {
  const [deleteDokument, { isLoading: isDeleting }] = useDeleteDokumentMutation();
  const { dokument: viewedDokument, viewDokument } = useContext(DocumentViewerContext);

  const onClick = async () => {
    if (
      viewedDokument !== null &&
      isViewedUploadedDokument(viewedDokument) &&
      viewedDokument.dokumentId === dokumentId
    ) {
      viewDokument(null);
    }

    // The in-flight bucket upload is only aborted once the delete has actually succeeded. If it
    // succeeds too early (before the mutation resolves), a failed delete would restore a document
    // whose upload was already permanently cancelled, leaving it stuck in `UPLOADING` forever.
    // If delete fails, the upload is left running and the document restored by the mutation's own
    // optimistic-rollback logic.
    try {
      await deleteDokument({ id: registreringId, dokumentId }).unwrap();
      abortUpload(dokumentId);
    } catch {
      // Delete failed — the mutation's own optimistic-rollback logic already restored the
      // document, and the upload was never aborted, so it can keep running.
    }
  };

  return (
    <Tooltip content="Slett" delay={500}>
      <Button
        size="xsmall"
        variant="tertiary-neutral"
        data-color="neutral"
        loading={isDeleting}
        onClick={onClick}
        icon={<XMarkIcon aria-hidden />}
        className="hover:text-ax-text-danger-decoration"
      />
    </Tooltip>
  );
};
