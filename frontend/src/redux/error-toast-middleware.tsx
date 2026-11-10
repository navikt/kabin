import { isApiError, isObject } from '@app/components/footer/error-type-guard';
import { ErrorDetails } from '@app/components/toast/error-details';
import { toast } from '@app/components/toast/store';
import { isRejectedWithValue, type Middleware } from '@reduxjs/toolkit';

export const errorToastMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const { payload, meta } = action;

    // Don't show error toasts for specific errors - they spawn their own error components
    if (isArg(meta.arg) && skipToast(payload, meta.arg)) {
      return next(action);
    }

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

const skipToast = (payload: unknown, arg: Arg): boolean => {
  if (!isPayload(payload)) {
    return false;
  }

  if (arg.endpointName === 'setSaksnrITr' && payload.status === 400) {
    return true;
  }

  return false;
};

type Arg = { endpointName: string };

const isArg = (obj: unknown): obj is Arg =>
  isObject(obj) && 'endpointName' in obj && typeof obj.endpointName === 'string';

type Payload = {
  status: number;
  data: unknown;
};

const isPayload = (obj: unknown): obj is Payload =>
  isObject(obj) && 'status' in obj && typeof obj.status === 'number' && 'data' in obj;
