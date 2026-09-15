import type { Registrering } from '@app/redux/api/registreringer/types';
import { createContext } from 'react';

export const RegistreringContext = createContext<Registrering | undefined>(undefined);
