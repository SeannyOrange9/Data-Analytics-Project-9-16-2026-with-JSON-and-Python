import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/auth/AuthContext';
import { ToastProvider } from '@/components/ui/toast';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { MapPage } from '@/pages/MapPage';
import { HouseholdsPage } from '@/pages/HouseholdsPage';
import { CentersPage } from '@/pages/CentersPage';
import { ResourcesPage } from '@/pages/ResourcesPage';
import { IncidentsPage } from '@/pages/IncidentsPage';
import { IncidentDetailPage } from '@/pages/IncidentDetailPage';
import { AllocationPage } from '@/pages/AllocationPage';
import { SimulatorPage } from '@/pages/SimulatorPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import type { Role } from '@/api/types';

function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

function RoleGate({ role, children }: { role: Role; children: React.ReactNode }) {
  const { hasRole } = useAuth();
  if (!hasRole(role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <Protected>
                  <AppShell />
                </Protected>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/households" element={<HouseholdsPage />} />
              <Route path="/centers" element={<CentersPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/incidents/:id" element={<IncidentDetailPage />} />
              <Route
                path="/allocation"
                element={
                  <RoleGate role="responder">
                    <AllocationPage />
                  </RoleGate>
                }
              />
              <Route
                path="/simulator"
                element={
                  <RoleGate role="responder">
                    <SimulatorPage />
                  </RoleGate>
                }
              />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}