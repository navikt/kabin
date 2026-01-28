import { useYtelseName } from '@app/hooks/kodeverk';
import { Tag } from '@navikt/ds-react';

interface Props {
  ytelseId: string | null;
}

export const YtelseTag = ({ ytelseId }: Props) => {
  const ytelseName = useYtelseName(ytelseId);

  if (ytelseName === undefined) {
    return (
      <Tag data-color="neutral" variant="outline" size="small">
        Ingen
      </Tag>
    );
  }

  return (
    <Tag data-color="info" size="small" variant="outline">
      {ytelseName}
    </Tag>
  );
};
