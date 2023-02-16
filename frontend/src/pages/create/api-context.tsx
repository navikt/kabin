import React, { createContext, useState } from 'react';
import { IValidationSection } from '../../components/footer/error-type-guard';
import { Create } from '../../types/create';

interface IApiContext {
  payload: Create | null;
  setPayload: (payload: Create | null) => void;
  errors: IValidationSection[] | null;
  setErrors: (errors: IValidationSection[] | null) => void;
}

export const ApiContext = createContext<IApiContext>({
  payload: null,
  setPayload: () => {},
  errors: null,
  setErrors: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const ApiContextState = ({ children }: Props) => {
  const [payload, setPayload] = useState<Create | null>(null);
  const [errors, setErrors] = useState<IValidationSection[] | null>(null);

  return <ApiContext.Provider value={{ payload, setPayload, errors, setErrors }}>{children}</ApiContext.Provider>;
};
