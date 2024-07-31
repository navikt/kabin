import { List, ListItem } from '@navikt/ds-react/List';
import { ReadOnly } from '@app/components/read-only-info/read-only-info';
import { useAddressLines } from '@app/components/svarbrev/address/use-address-lines';
import { useRegistrering } from '@app/hooks/use-registrering';
import { Receiver } from '@app/redux/api/registreringer/types';
import { Utsendingskanal } from '@app/types/common';
import { HandlingEnum } from '@app/types/recipient';

const getHandlingLabel = (handling: HandlingEnum, utsendingskanal: Utsendingskanal) => {
  switch (handling) {
    case HandlingEnum.AUTO:
      return Utsendingskanal[utsendingskanal];
    case HandlingEnum.CENTRAL_PRINT:
      return 'Sentral utskrift';
    case HandlingEnum.LOCAL_PRINT:
      return 'Lokal utskrift';
  }
};

const ReadOnlyRecipient = ({ recipient }: { recipient: Receiver }) => {
  const handling = getHandlingLabel(recipient.handling, recipient.part.utsendingskanal);
  const label = `${recipient.part.name} (${handling})`;
  const addressLines = useAddressLines(recipient.overriddenAddress);

  if (addressLines.length === 0) {
    return <ListItem>{label}</ListItem>;
  }

  return (
    <ListItem>
      {label}
      <span>{addressLines.join(' ,')}</span>
    </ListItem>
  );
};

export const ReadOnlyReceivers = () => {
  const { svarbrev } = useRegistrering();

  const list = svarbrev.receivers.map((r) => <ReadOnlyRecipient key={r.id} recipient={r} />);

  return (
    <ReadOnly label={list.length === 1 ? 'Mottaker' : 'Mottakere'} id="svarbrevmottakere">
      <List size="small" style={{ marginTop: 0 }}>
        {list}
      </List>
    </ReadOnly>
  );
};
