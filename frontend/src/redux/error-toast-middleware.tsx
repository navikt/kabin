import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { isApiError } from '@app/components/footer/error-type-guard';
import { ErrorDetails } from '@app/components/toast/error-details';
import { toast } from '@app/components/toast/store';

export const errorToastMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const { payload } = action;

    if (typeof payload === 'object' && payload !== null && 'data' in payload && isApiError(payload.data)) {
      // Validation error on finish - error summary will be shown in a "proprietary" popup
      if ('sections' in payload.data) {
        return next(action);
      }

      toast.error(<ErrorDetails error={payload.data} />);
    } else {
      toast.error('Ukjent feil');
    }
  }

  return next(action);
};
