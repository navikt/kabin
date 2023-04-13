import React from 'react';
import { isApiError } from '@app/components/footer/error-type-guard';
import { ErrorDetails } from './error-details';
import { toast } from './store';
import { ToastType } from './types';

export const errorToast = async (error: unknown) => {
  if (isApiError(error)) {
    toast({ type: ToastType.ERROR, message: <ErrorDetails error={error} /> });
  } else {
    toast({ type: ToastType.ERROR, message: 'Ukjent feil' });
  }
};
