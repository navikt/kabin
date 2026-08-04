import { getFailedMessage } from '@app/components/documents/upload/dokument-row/dokument-status-indicator';
import { useResetDokumentStatusMutation } from '@app/redux/api/registreringer/documents';
import type { DokumentStatus } from '@app/redux/api/registreringer/types';
import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';

interface Props {
  registreringId: string;
  dokumentId: string;
  status: DokumentStatus;
}

/**
 * Replaces `DokumentStatusIndicator` for retryable failed statuses (see
 * `DOKUMENT_RETRYABLE_STATUSES`), combining the failure reason and the retry action into a single
 * tooltip + button occupying the status column.
 *
 * Only issues the first of the two steps a "retry" consists of: resetting the document's status
 * server-side, via `useResetDokumentStatusMutation`. The second step - re-opening the `/confirm`
 * SSE connection, which is what actually triggers the API to retry processing the document - is
 * not this component's concern: `useDokumentConfirmSse` (see `upload-dokumenter.tsx`) reacts to
 * the resulting non-terminal status on its own and reconnects automatically.
 */
export const RetryDokumentButton = ({ registreringId, dokumentId, status }: Props) => {
  const [resetDokumentStatus, { isLoading: isRetrying }] = useResetDokumentStatusMutation();

  const onClick = () => resetDokumentStatus({ id: registreringId, dokumentIds: [dokumentId] });

  return (
    <Tooltip content={`${getFailedMessage(status)} Klikk for å prøve igjen.`} placement="top">
      <Button
        size="xsmall"
        variant="tertiary-neutral"
        data-color="danger"
        loading={isRetrying}
        onClick={onClick}
        icon={<ArrowsCirclepathIcon aria-hidden />}
      />
    </Tooltip>
  );
};
