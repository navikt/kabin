import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { StaticDataLoader } from '@app/components/app/static-data-context';
import { NavHeader } from '@app/components/header/header';
import { Toasts } from '@app/components/toast/toasts';
import { VersionCheckerStatus } from '@app/components/version-checker/version-checker-status';
import { reduxStore } from '@app/redux/configure-store';
import { GlobalStyles } from './global-styles';
import { Router } from './router';

export const App = () => (
  <StrictMode>
    <BrowserRouter>
      <StaticDataLoader>
        <Provider store={reduxStore}>
          <GlobalStyles />
          <NavHeader />
          <Router />
          <Toasts />
          <VersionCheckerStatus />
        </Provider>
      </StaticDataLoader>
    </BrowserRouter>
  </StrictMode>
);
