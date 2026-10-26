import { AppTheme, useAppTheme } from '@app/app-theme';
import { PDF_PARAMS } from '@app/components/svarbrev/preview/constants';
import { ResponseError } from '@app/components/svarbrev/preview/create-url';
import type { PdfLoader } from '@app/components/svarbrev/preview/pdf-loader';
import { BodyShort, LocalAlert } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

interface Props {
  loader: PdfLoader;
}

export const RenderPdf = ({ loader }: Props) => {
  const [error, setError] = useState<unknown | null>(null);
  const [url, setUrl] = useState(loader.url);
  const [ready, setReady] = useState(false);
  const appTheme = useAppTheme();

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
      <LocalAlert status="error" size="small" key={loader.key}>
        <LocalAlert.Header>
          <LocalAlert.Title>Kunne ikke generere PDF.</LocalAlert.Title>
        </LocalAlert.Header>
        <LocalAlert.Content>
          <BodyShort>{getErrorMessage(error)}</BodyShort>
        </LocalAlert.Content>
      </LocalAlert>
    );
  }

  if (url === null) {
    return null;
  }

  return (
    <object
      className="absolute h-full w-full"
      key={loader.key}
      data={`${url}${PDF_PARAMS}`}
      type="application/pdf"
      onLoad={() => setTimeout(() => setReady(true), 500)}
      style={{ zIndex: ready ? 0 : -1, filter: appTheme === AppTheme.DARK ? 'hue-rotate(180deg) invert(1)' : 'none' }}
      aria-label="Svarbrev PDF"
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
