import { useAppTheme } from '@app/app-theme';
import '@app/global-styles.css';
import { ProtectedRoute } from '@app/components/app/protected-route';
import { RouterLoader } from '@app/components/app/router-loader';
import { NavHeader } from '@app/components/header/header';
import { RegistreringContextLoader } from '@app/components/registrering-context-loader/registrering-context-loader';
import { Toasts } from '@app/components/toast/toasts';
import { VersionCheckerStatus } from '@app/components/version-checker/version-checker-status';
import { AdminPage } from '@app/pages/admin';
import { IndexPage } from '@app/pages/index';
import { RegistreringPage } from '@app/pages/registrering/registrering';
import { StatusPage } from '@app/pages/status/status';
import { Role } from '@app/types/bruker';
import { Theme, VStack } from '@navikt/ds-react';
import { Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

export const Router = () => (
  <Suspense fallback={<RouterLoader />}>
    <Routes>
      <Route element={<AppWrapper />}>
        <Route element={<ProtectedRoute roles={[Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER]} />}>
          <Route index element={<IndexPage />} />

          <Route path="/registrering/:id" element={<RegistreringContextLoader />}>
            <Route index element={<RegistreringPage />} />
            <Route path="status" element={<StatusPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={[Role.KABAL_ADMIN]} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  </Suspense>
);

const AppWrapper = () => {
  const theme = useAppTheme();

  return (
    <Theme theme={theme} className="h-full w-full">
      <VStack height="100%" width="100%" overflow="hidden">
        <NavHeader />
        <Outlet />
        <Toasts />
        <VersionCheckerStatus />
      </VStack>
    </Theme>
  );
};
