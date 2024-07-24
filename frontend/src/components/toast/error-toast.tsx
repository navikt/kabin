import { isApiError } from '@app/components/footer/error-type-guard';
import { ErrorDetails } from './error-details';
import { toast } from './store';

export const errorToast = async (error: unknown) => {
  if (isApiError(error)) {
    toast.error(<ErrorDetails error={error} />);
  } else {
    toast.error('Ukjent feil');
  }
};
