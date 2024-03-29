import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StaticDataLoader } from '@app/components/app/static-data-context';
import { NavHeader } from '@app/components/header/header';
import { Toasts } from '@app/components/toast/toasts';
import { GlobalStyles } from './global-styles';
import { Router } from './router';

export const App = () => (
  <React.StrictMode>
    <BrowserRouter>
      <StaticDataLoader>
        <GlobalStyles />
        <NavHeader />
        <Router />
        <Toasts />
      </StaticDataLoader>
    </BrowserRouter>
  </React.StrictMode>
);
