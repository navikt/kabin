import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@app/components/app/protected-route';
import { AdminPage } from '@app/pages/admin';
import { IndexPage } from '@app/pages/index';
import { RegistreringPage } from '@app/pages/registrering/registrering';
import { Role } from '@app/types/bruker';
import { RouterLoader } from './router-loader';

export const Router = () => (
  <Suspense fallback={<RouterLoader />}>
    <Routes>
      <Route element={<ProtectedRoute roles={[Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER]} />}>
        <Route index element={<IndexPage />} />
        <Route path="/registrering/:id" element={<RegistreringPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={[Role.KABAL_ADMIN]} />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Suspense>
);
