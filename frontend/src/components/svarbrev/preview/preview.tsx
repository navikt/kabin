import { Alert, BodyShort, Loader } from '@navikt/ds-react';
import React, { useCallback, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { recipientToApiRecipient } from '@app/components/footer/anke-hooks';
import { ResponseError } from '@app/components/svarbrev/preview/create-url';
import { PDF_MANAGER } from '@app/components/svarbrev/preview/pdf-manager';
import { partToPartId } from '@app/domain/converters';
import { IAnkeOverstyringer, ValidSvarbrev } from '@app/pages/create/api-context/types';
import { IAnkeMulighet } from '@app/types/mulighet';

interface Props {
  mulighet: IAnkeMulighet;
  overstyringer: IAnkeOverstyringer;
  svarbrev: ValidSvarbrev;
  journalpostId: string;
}

export const Preview = (props: Props) => {
  const { isLoading, url, error } = useUrl(props);

  if (error !== null) {
    return (
      <Alert variant="error">
        <BodyShort>Kunne ikke generere PDF.</BodyShort>
        <BodyShort>{error instanceof ResponseError ? error.toString() : error.message}</BodyShort>
      </Alert>
    );
  }

  if (isLoading) {
    return <Loader size="3xlarge">Laster...</Loader>;
  }

  if (url === null) {
    return null;
  }

  return <StyledObject data={`${url}${PDF_PARAMS}`} type="application/pdf" width="100%" height="100%" />;
};

const PDF_PARAMS = '#toolbar=1&view=fitH&zoom=page-width';

const StyledObject = styled.object`
  width: 100%;
  aspect-ratio: 0.66; // 210/297 + PDF toolbar
`;

const useUrl = ({ journalpostId, mulighet, overstyringer, svarbrev }: Props) => {
  const [error, setError] = useState<Error | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const errorListener = useCallback(
    (e: unknown) => setError(e instanceof Error ? e : new Error('Failed to create PDF')),
    [],
  );

  useEffect(() => {
    PDF_MANAGER.addUrlListener(setUrl);
    PDF_MANAGER.addErrorListener(errorListener);

    PDF_MANAGER.load({
      id: mulighet.id,
      sakenGjelder: {
        id: mulighet.sakenGjelder.id,
        type: mulighet.sakenGjelder.type,
      },
      mottattKlageinstans: overstyringer.mottattKlageinstans,
      avsender: null,
      fristInWeeks: overstyringer.fristInWeeks,
      fullmektig: partToPartId(overstyringer.fullmektig),
      hjemmelIdList: [],
      journalpostId,
      klager: partToPartId(overstyringer.klager),
      saksbehandlerIdent: '',
      sourceId: mulighet.sourceId,
      ytelseId: overstyringer.ytelseId,
      svarbrevInput: {
        enhetId: svarbrev.enhetId,
        fullmektigFritekst: svarbrev.fullmektigFritekst,
        receivers: svarbrev.receivers.map(recipientToApiRecipient),
        title: svarbrev.title,
      },
    });

    return () => {
      PDF_MANAGER.removeUrlListener(setUrl);
      PDF_MANAGER.removeErrorListener(errorListener);
    };
  }, [
    errorListener,
    journalpostId,
    mulighet.id,
    mulighet.sakenGjelder.id,
    mulighet.sakenGjelder.type,
    mulighet.sourceId,
    overstyringer.fristInWeeks,
    overstyringer.fullmektig,
    overstyringer.klager,
    overstyringer.mottattKlageinstans,
    overstyringer.ytelseId,
    svarbrev.enhetId,
    svarbrev.fullmektigFritekst,
    svarbrev.receivers,
    svarbrev.title,
  ]);

  useEffect(() => () => PDF_MANAGER.clear(), []);

  return { isLoading: url === null, url, error };
};
