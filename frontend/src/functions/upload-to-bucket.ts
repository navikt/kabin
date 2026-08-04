class BucketUploadError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

interface UploadToBucketParams {
  uploadUrl: string;
  fields: Record<string, string>;
  file: File;
  onProgress: (loaded: number, total: number) => void;
  signal?: AbortSignal;
}

/**
 * Uploads a file to a GCS signed POST policy URL, reporting upload progress.
 * Uses XMLHttpRequest, since `fetch` does not expose upload progress events.
 */
export const uploadToBucket = ({ uploadUrl, fields, file, onProgress, signal }: UploadToBucketParams) =>
  new Promise<void>((resolve, reject) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(fields)) {
      formData.append(key, value);
    }

    // The file must be the last field in a GCS signed POST policy upload.
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    const onAbort = () => xhr.abort();

    if (signal !== undefined) {
      if (signal.aborted) {
        onAbort();
      } else {
        signal.addEventListener('abort', onAbort);
      }
    }

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        onProgress(event.loaded, event.total);
      }
    });

    xhr.addEventListener('load', () => {
      signal?.removeEventListener('abort', onAbort);

      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(file.size, file.size);
        resolve();
      } else {
        reject(new BucketUploadError(`Opplasting feilet med status ${xhr.status}`, xhr.status));
      }
    });

    xhr.addEventListener('error', () => {
      signal?.removeEventListener('abort', onAbort);
      reject(new BucketUploadError('Opplasting feilet', xhr.status));
    });

    xhr.addEventListener('abort', () => {
      signal?.removeEventListener('abort', onAbort);
      reject(new DOMException('Opplasting avbrutt', 'AbortError'));
    });

    xhr.open('POST', uploadUrl);
    xhr.send(formData);
  });
