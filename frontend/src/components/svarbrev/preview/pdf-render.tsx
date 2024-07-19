import { Alert, BodyShort } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { ResponseError } from '@app/components/svarbrev/preview/create-url';
import { PdfLoader } from '@app/components/svarbrev/preview/pdf-loader';
import { PDF_PARAMS } from '@app/components/toast/constants';

interface Props {
  loader: PdfLoader;
}

export const RenderPdf = ({ loader }: Props) => {
  const [error, setError] = useState<unknown | null>(null);
  const [url, setUrl] = useState(loader.url);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loader.url === null) {
      loader.addListener(setUrl);
      loader.addErrorListener(setError);

      return () => {
        loader.removeListener(setUrl);
        loader.removeErrorListener(setError);
      };
    }
  }, [loader]);

  if (error !== null) {
    return (
      <Alert variant="error" key={loader.key}>
        <BodyShort>Kunne ikke generere PDF.</BodyShort>
        <BodyShort>{getErrorMessage(error)}</BodyShort>
      </Alert>
    );
  }

  if (url === null) {
    return null;
  }

  return (
    <StyledObject
      key={loader.key}
      data={`${url}${PDF_PARAMS}`}
      type="application/pdf"
      onLoad={() => setTimeout(() => setReady(true), 500)}
      style={{ zIndex: ready ? 0 : -1 }}
    />
  );
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof ResponseError) {
    return error.toString();
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ukjent feil';
};

const StyledObject = styled.object`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
`;
