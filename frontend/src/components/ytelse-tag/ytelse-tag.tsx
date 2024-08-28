import { useYtelseName } from '@app/hooks/kodeverk';
import { Tag } from '@navikt/ds-react';

interface Props {
  ytelseId: string | null;
}

export const YtelseTag = ({ ytelseId }: Props) => {
  const ytelseName = useYtelseName(ytelseId);

  if (ytelseName === undefined) {
    return (
      <Tag variant="neutral" size="small">
        Ingen
      </Tag>
    );
  }

  return (
    <Tag size="small" variant="info">
      {ytelseName}
    </Tag>
  );
};
