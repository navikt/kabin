import { styled } from 'styled-components';
import { Card } from '@app/components/card/card';
import { EditVarsletFrist } from '@app/components/svarbrev/edit-varslet-frist';
import { SetFullmektig } from '@app/components/svarbrev/fullmektig-name';
import { Preview } from '@app/components/svarbrev/preview/preview';
import { Receivers } from '@app/components/svarbrev/receivers';
import { SetTitle } from '@app/components/svarbrev/title';
import { SvarbrevSetting } from '@app/types/svarbrev-settings';

interface Props {
  setting: SvarbrevSetting;
}

export const InternalSvarbrevInput = ({ setting }: Props) => (
  <>
    <Card title="Svarbrev">
      <Row>
        <SetTitle />
        <SetFullmektig />
      </Row>

      <EditVarsletFrist setting={setting} />

      <Receivers />
    </Card>

    <Card title="Forhåndsvisning av svarbrev">
      <Preview />
    </Card>
  </>
);

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 8px;
`;
