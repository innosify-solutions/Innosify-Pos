import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@core/layout';
import { getActiveModuleRoutes } from './moduleRegistry.js';

/**
 * Application-level routing.
 * Business routes are registered by their respective modules.
 */
export function AppRouter() {
  const moduleRoutes = getActiveModuleRoutes();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {moduleRoutes}
          <Route path="*" element={<Navigate to="/retail" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
