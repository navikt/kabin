import type { UploadProgressEntry } from '@app/components/documents/upload/use-upload-files';
import { formatFileSize } from '@app/domain/file-size';
import {
  DOKUMENT_FAILED_STATUSES,
  DokumentStatus,
  type RegistreringDokument,
} from '@app/redux/api/registreringer/types';
import {
  CheckmarkCircleIcon,
  ExclamationmarkTriangleFillIcon,
  FileCheckmarkIcon,
  FileImportIcon,
  VirusIcon,
} from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';
import type { ComponentType } from 'react';

interface Props {
  dokument: RegistreringDokument;
  uploadProgress?: UploadProgressEntry;
}

const ICON_SIZE = '1.25rem';

/**
 * An icon (or, while uploading, the progress percentage) reflecting the document's processing status.
 */
export const DokumentStatusIndicator = ({ dokument, uploadProgress }: Props) => {
  if (dokument.status === DokumentStatus.UPLOADING) {
    if (uploadProgress?.failed) {
      return (
        <ActionIcon
          label="Opplasting feilet. Slett filen og prøv igjen."
          icon={ExclamationmarkTriangleFillIcon}
          variant={ActionIconVariant.DANGER}
        />
      );
    }

    // 100% is never actually shown: it's immediately followed by the `UPLOADING_DONE` status.
    // Capping it at 99 keeps the column a fixed width, avoiding jitter as the digit count would
    // otherwise grow from e.g. "9%" to "99%" to "100%".
    const percent = Math.min(uploadProgress?.percent ?? 0, 99);

    return (
      <Tooltip content={`${formatFileSize(uploadProgress?.bytesPerSecond ?? 0)}/s`}>
        <span className="inline-flex shrink-0 items-center justify-center whitespace-nowrap font-mono text-[13px] text-ax-text-neutral tabular-nums opacity-60">
          {percent}%
        </span>
      </Tooltip>
    );
  }

  if (dokument.status === DokumentStatus.UPLOADING_DONE) {
    return <ActionIcon label="Bekrefter opplasting" icon={FileCheckmarkIcon} />;
  }

  if (dokument.status === DokumentStatus.VIRUS_SCANNING) {
    return <ActionIcon label="Virussjekk" icon={VirusIcon} />;
  }

  if (dokument.status === DokumentStatus.VIRUS_SCANNING_DONE) {
    return <ActionIcon label="Virussjekk ferdig" icon={VirusIcon} />;
  }

  if (dokument.status === DokumentStatus.CONVERTING) {
    return <ActionIcon label="Konverterer" icon={FileImportIcon} />;
  }

  if (dokument.status === DokumentStatus.CONVERTING_DONE) {
    return <ActionIcon label="Konvertering ferdig" icon={FileCheckmarkIcon} />;
  }

  if (dokument.status === DokumentStatus.DONE) {
    return (
      <ActionIcon
        label="Dokumentet er klart til journalføring"
        icon={CheckmarkCircleIcon}
        variant={ActionIconVariant.SUCCESS}
      />
    );
  }

  if (DOKUMENT_FAILED_STATUSES.includes(dokument.status)) {
    return (
      <ActionIcon
        label={getFailedMessage(dokument.status)}
        icon={ExclamationmarkTriangleFillIcon}
        variant={ActionIconVariant.DANGER}
      />
    );
  }

  return null;
};

interface IconProps {
  'aria-hidden'?: boolean;
  fontSize?: string;
}

interface ActionIconProps {
  label: string;
  icon: ComponentType<IconProps>;
  variant?: ActionIconVariant;
}

enum ActionIconVariant {
  NEUTRAL = 'neutral',
  DANGER = 'danger',
  SUCCESS = 'success',
}

const ActionIcon = ({ label, icon: Icon, variant = ActionIconVariant.NEUTRAL }: ActionIconProps) => (
  <Tooltip content={label} placement="top">
    <span className={`inline-flex shrink-0 rounded p-0.5 ${ACTION_ICON_CLASS_NAME[variant]}`}>
      <Icon aria-hidden fontSize={ICON_SIZE} />
    </span>
  </Tooltip>
);

const ACTION_ICON_CLASS_NAME: Record<ActionIconVariant, string> = {
  [ActionIconVariant.DANGER]: 'text-ax-text-danger',
  [ActionIconVariant.SUCCESS]: 'text-ax-text-success',
  [ActionIconVariant.NEUTRAL]: 'text-ax-text-neutral opacity-60',
};

export const getFailedMessage = (status: DokumentStatus): string => {
  switch (status) {
    case DokumentStatus.VIRUS_FOUND:
      return 'Fant virus i filen. Filen kan ikke brukes.';
    case DokumentStatus.VIRUS_SCAN_FAILED:
      return 'Virussjekk feilet.';
    case DokumentStatus.CONVERSION_FAILED:
      return 'Kunne ikke konvertere filen.';
    case DokumentStatus.UNSUPPORTED_TYPE:
      return 'Filtypen støttes ikke. Slett filen.';
    case DokumentStatus.UNEXPECTED_ERROR:
      return 'Noe gikk feil.';
    case DokumentStatus.UPLOADING:
    case DokumentStatus.UPLOADING_DONE:
    case DokumentStatus.VIRUS_SCANNING:
    case DokumentStatus.VIRUS_SCANNING_DONE:
    case DokumentStatus.CONVERTING:
    case DokumentStatus.CONVERTING_DONE:
    case DokumentStatus.DONE:
      return 'Noe gikk feil.';
  }
};
