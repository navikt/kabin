import { createSvarbrevPDF } from '@app/api/api';
import { PreviewPdfPayload } from '@app/types/preview';

export const createSvarbrevUrl = async (
  params: PreviewPdfPayload,
  abortController: AbortController,
  retry: number = 0,
): Promise<string> => {
  const res = await createSvarbrevPDF(params, abortController.signal);

  if (!res.ok) {
    if (!abortController.signal.aborted && retry < 3 && res.status >= 500) {
      await delay(retry * 1000);

      return createSvarbrevUrl(params, abortController, retry + 1);
    }

    throw new ResponseError(`Prøvde å generere PDF ${retry + 1} ganger. APIet svarte med ${res.status}.`, res);
  }

  const blob = await res.blob();
  const file = new File([blob], params.svarbrevInput.title, { type: 'application/pdf' });

  return URL.createObjectURL(file);
};

export class ResponseError extends Error {
  constructor(
    public message: string,
    public response: Response,
  ) {
    super(message);
  }

  toString() {
    return `${this.message} (${this.response.status} ${this.response.statusText})`;
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
