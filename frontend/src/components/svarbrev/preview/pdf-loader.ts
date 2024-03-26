import { createSvarbrevUrl } from '@app/components/svarbrev/preview/create-url';
import { ErrorListenerFn, UrlListenerFn } from '@app/components/svarbrev/preview/types';
import { PreviewPdfPayload } from '@app/types/preview';

export class PdfLoader {
  public url: string | null = null;
  public abortController: AbortController = new AbortController();
  private listeners: UrlListenerFn[] = [];
  private errorListeners: ErrorListenerFn[] = [];

  constructor(
    params: PreviewPdfPayload,
    public readonly key: string,
  ) {
    this.load(params);
  }

  private async load(params: PreviewPdfPayload) {
    try {
      const url = await createSvarbrevUrl(params, this.abortController);
      this.listeners.forEach((listener) => listener(url));
      this.url = url;
    } catch (error) {
      this.errorListeners.forEach((listener) => listener(error));
    }
  }

  public revoke() {
    if (this.url !== null) {
      URL.revokeObjectURL(this.url);
    }
  }

  public abort() {
    if (this.url !== null) {
      return;
    }

    this.abortController.abort();
  }

  public isAborted() {
    return this.abortController.signal.aborted && this.url === null;
  }

  public addListener(listener: UrlListenerFn) {
    if (this.listeners.includes(listener)) {
      return this;
    }

    this.listeners.push(listener);

    if (this.url !== null) {
      listener(this.url);
    }
  }

  public removeListener(listener: UrlListenerFn) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  public addErrorListener(listener: ErrorListenerFn) {
    if (this.errorListeners.includes(listener)) {
      return this;
    }

    this.errorListeners.push(listener);
  }

  public removeErrorListener(listener: ErrorListenerFn) {
    this.errorListeners = this.errorListeners.filter((l) => l !== listener);
  }
}
