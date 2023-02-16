import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { NavHeader } from '../header/header';
import { Toasts } from '../toast/toasts';
import { GlobalStyles } from './global-styles';
import { Router } from './router';

export const App = () => (
  <React.StrictMode>
    <BrowserRouter>
      <GlobalStyles />
      <NavHeader />
      <Router />
      <Toasts />
    </BrowserRouter>
  </React.StrictMode>
);
