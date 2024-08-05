import { Tag } from '@navikt/ds-react';
import { useYtelseName } from '@app/hooks/kodeverk';

interface Props {
  ytelseId: string | null;
}

export const Ytelse = ({ ytelseId }: Props) => {
  const ytelseName = useYtelseName(ytelseId);

  if (ytelseId === null) {
    return (
      <Tag variant="neutral-moderate" size="small">
        Ingen
      </Tag>
    );
  }

  return (
    <Tag variant="info-moderate" size="small">
      {ytelseName}
    </Tag>
  );
};
