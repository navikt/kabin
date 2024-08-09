import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { GlobalStyles } from '@app/components/app/global-styles';
import { Router } from '@app/components/app/router';
import { StaticDataLoader } from '@app/components/app/static-data-context';
import { NavHeader } from '@app/components/header/header';
import { Toasts } from '@app/components/toast/toasts';
import { VersionCheckerStatus } from '@app/components/version-checker/version-checker-status';
import { reduxStore } from '@app/redux/configure-store';

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
