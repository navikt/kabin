import { PdfLoader } from '@app/components/svarbrev/preview/pdf-loader';
import { ErrorListenerFn, UrlListenerFn } from '@app/components/svarbrev/preview/types';
import { PreviewPdfPayload } from '@app/types/preview';

class PdfManager {
  private listeners: UrlListenerFn[] = [];
  private errorListeners: ErrorListenerFn[] = [];
  private cache: Map<string, PdfLoader> = new Map();

  load(params: PreviewPdfPayload) {
    const cachKey = createCacheKey(params);

    console.log('load', cachKey, this.cache.size);

    let exists = false;

    for (const [key, item] of this.cache.entries()) {
      if (key === cachKey) {
        exists = true;

        console.log('exists', key);

        if (item.url !== null) {
          this.urlListener(item.url);
        }
      } else if (item.url === null) {
        item.abort();
        this.cache.delete(key);
      }
    }

    if (!exists) {
      console.log('create', cachKey);
      const loader = new PdfLoader(params);

      loader.addListener(this.urlListener);
      loader.addErrorListener(this.errorListener);

      this.cache.set(cachKey, loader);
    }
  }

  clear() {
    for (const item of this.cache.values()) {
      item.abort();
    }

    this.cache.clear();
  }

  private urlListener = (url: string) => {
    this.listeners.forEach((listener) => listener(url));
  };

  private errorListener = (error: unknown) => {
    this.errorListeners.forEach((listener) => listener(error));
  };

  addUrlListener(listener: UrlListenerFn) {
    if (this.listeners.includes(listener)) {
      return;
    }

    this.listeners.push(listener);
  }

  removeUrlListener(listener: UrlListenerFn) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  addErrorListener(listener: ErrorListenerFn) {
    if (this.errorListeners.includes(listener)) {
      return;
    }

    this.errorListeners.push(listener);
  }

  removeErrorListener(listener: ErrorListenerFn) {
    this.errorListeners = this.errorListeners.filter((l) => l !== listener);
  }
}

const createCacheKey = (params: PreviewPdfPayload) => JSON.stringify(params);

export const PDF_MANAGER = new PdfManager();
