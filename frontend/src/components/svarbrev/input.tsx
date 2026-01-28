import { Card } from '@app/components/card/card';
import { EditVarsletFrist } from '@app/components/svarbrev/edit-varslet-frist';
import { SetFullmektig } from '@app/components/svarbrev/fullmektig-name';
import { Preview } from '@app/components/svarbrev/preview/preview';
import { Receivers } from '@app/components/svarbrev/receivers';
import { SetTitle } from '@app/components/svarbrev/title';
import { useRegistrering } from '@app/hooks/use-registrering';
import type { SvarbrevSetting } from '@app/types/svarbrev-settings';
import { HGrid } from '@navikt/ds-react';

interface Props {
  setting: SvarbrevSetting;
}

export const InternalSvarbrevInput = ({ setting }: Props) => {
  const { overstyringer } = useRegistrering();

  return (
    <>
      <Card title="Svarbrev">
        {overstyringer.fullmektig === null ? (
          <SetTitle />
        ) : (
          <HGrid columns={2} gap="space-8">
            <SetTitle />
            <SetFullmektig />
          </HGrid>
        )}

        <EditVarsletFrist setting={setting} />

        <Receivers />
      </Card>
      <Card title="Forhåndsvisning av svarbrev">
        <Preview />
      </Card>
    </>
  );
};
