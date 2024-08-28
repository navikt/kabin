import { PersonDetails } from '@app/pages/registrering/person/details';
import { useGetPartQuery } from '@app/redux/api/part';
import { Loader } from '@navikt/ds-react';

interface PersonInfoProps {
  sakenGjelderValue: string;
}

export const PersonInfo = ({ sakenGjelderValue }: PersonInfoProps) => {
  const { data, isLoading } = useGetPartQuery(sakenGjelderValue);

  if (isLoading || data === undefined) {
    return <Loader />;
  }

  return <PersonDetails person={data} />;
};
