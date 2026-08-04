import type { UploadProgressEntry } from '@app/components/documents/upload/use-upload-files';
import { DokumentStatus, type RegistreringDokument } from '@app/redux/api/registreringer/types';

interface Props {
  dokument: RegistreringDokument;
  uploadProgress?: UploadProgressEntry;
}

/**
 * Renders a subtle, custom progress effect stretched to fill the entire dokument row, used as a
 * background to visualize upload/processing progress behind the row's content.
 */
export const DokumentRowProgress = ({ dokument, uploadProgress }: Props) => {
  if (dokument.status === DokumentStatus.UPLOADING && !uploadProgress?.failed) {
    const percent = uploadProgress?.percent ?? 0;

    return (
      <ProgressTrack>
        <div
          className="h-full w-full origin-left transform-gpu bg-ax-bg-accent-strong transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `scaleX(${percent / 100})` }}
        />
      </ProgressTrack>
    );
  }

  if (
    dokument.status === DokumentStatus.UPLOADING_DONE ||
    dokument.status === DokumentStatus.VIRUS_SCANNING ||
    dokument.status === DokumentStatus.VIRUS_SCANNING_DONE ||
    dokument.status === DokumentStatus.CONVERTING ||
    dokument.status === DokumentStatus.CONVERTING_DONE
  ) {
    return (
      <ProgressTrack>
        <div className="absolute inset-y-0 left-0 w-2/5 transform-gpu animate-progress-sweep bg-ax-bg-accent-strong will-change-transform" />
      </ProgressTrack>
    );
  }

  return null;
};

const ProgressTrack = ({ children }: { children: React.ReactNode }) => (
  <div aria-hidden className="pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-1 overflow-hidden">
    {children}
  </div>
);
