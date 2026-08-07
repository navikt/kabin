import { useParams } from 'react-router';

export const useRegistreringId = () => {
  const { id } = useParams();

  if (id === undefined) {
    throw new Error('Do not use useRegistreringId outside of registrering routes');
  }

  return id;
};
