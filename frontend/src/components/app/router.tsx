import { ProtectedRoute } from '@app/components/app/protected-route';
import { RouterLoader } from '@app/components/app/router-loader';
import { RegistreringContextLoader } from '@app/components/registrering-context-loader/registrering-context-loader';
import { AdminPage } from '@app/pages/admin';
import { IndexPage } from '@app/pages/index';
import { RegistreringPage } from '@app/pages/registrering/registrering';
import { StatusPage } from '@app/pages/status/status';
import { Role } from '@app/types/bruker';
import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

export const Router = () => (
  <Suspense fallback={<RouterLoader />}>
    <Routes>
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
    </Routes>
  </Suspense>
);
