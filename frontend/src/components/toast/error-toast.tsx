import { isApiError } from '@app/components/footer/error-type-guard';
import { ErrorDetails } from './error-details';
import { toast } from './store';

// eslint-disable-next-line import/no-unused-modules
export const errorToast = async (error: unknown) => {
  if (isApiError(error)) {
    toast.error(<ErrorDetails error={error} />);
  } else {
    toast.error('Ukjent feil');
  }
};
