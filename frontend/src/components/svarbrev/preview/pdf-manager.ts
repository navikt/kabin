import { PdfLoader } from '@app/components/svarbrev/preview/pdf-loader';
import type { SvarbrevPreviewInput } from '@app/types/create';

class PdfManager {
  private cache: Map<string, PdfLoader> = new Map();

  public load(params: SvarbrevPreviewInput): PdfLoader {
    const cachKey = createCacheKey(params);
    const existing = this.cache.get(cachKey);

    if (existing === undefined) {
      const loader = new PdfLoader(params, cachKey);

      this.cache.set(cachKey, loader);

      return loader;
    }

    return existing;
  }

  public clear() {
    for (const item of this.cache.values()) {
      item.abort();
      item.revoke();
    }

    this.cache.clear();
  }

  public getLoaders(): PdfLoader[] {
    return Array.from(this.cache.values());
  }
}

const createCacheKey = (params: SvarbrevPreviewInput) => JSON.stringify(params);

export const PDF_MANAGER = new PdfManager();
