import { BodyShort, Button, Skeleton, Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { Link as RouterLink } from 'react-router-dom';
import { CopyPartIdButton } from '@app/components/copy-button/copy-part-id';
import { useGetPartQuery } from '@app/redux/api/part';
import { Registrering } from '@app/redux/api/registrering';
import { TYPE_NAME } from '@app/types/mulighet';

interface Props {
  registreringer: Registrering[];
  isLoading: boolean;
}

export const Registreringer = ({ registreringer, isLoading }: Props) => {
  if (isLoading) {
    return <div>Laster...</div>; // todo skeleton
  }

  if (registreringer.length === 0) {
    return <BodyShort>Ingen registreringer</BodyShort>;
  }

  return (
    <Table zebraStripes size="small">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Saken gjelder</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {registreringer.map((registrering) => (
          <Row key={registrering.id} registrering={registrering} />
        ))}
      </Table.Body>
    </Table>
  );
};

const Row = ({ registrering }: { registrering: Registrering }) => {
  const { typeId } = registrering;

  return (
    <Table.Row>
      <Table.DataCell>
        <SakenGjelder id={registrering.sakenGjelderValue} />
      </Table.DataCell>
      <Table.DataCell>{typeId === null ? 'Ingen' : TYPE_NAME[typeId]}</Table.DataCell>
      <Table.DataCell>
        <Button as={RouterLink} to={`/registrering/${registrering.id}`} size="small">
          Åpne
        </Button>
      </Table.DataCell>
    </Table.Row>
  );
};

const SakenGjelder = ({ id }: { id: string | null }) => {
  const { data: part } = useGetPartQuery(id ?? skipToken);

  if (id === null) {
    return <>Ingen</>;
  }

  return (
    <>
      {part === undefined ? (
        <Skeleton />
      ) : (
        <>
          {part.name}
          <CopyPartIdButton id={id} />
        </>
      )}
    </>
  );
};
