
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import LoginPage from './features/auth/pages/LoginPage'
import DashboardPage from './features/dashboard/pages/DashboardPage'
import AnalyticsPage from './features/analytics/pages/AnalyticsPage'
import WeeklyMetricsPage from './features/metrics/pages/WeeklyMetricsPage'
import InterventionsPage from './features/interventions/pages/InterventionsPage'
import ProtectedRoute from './components/layout/ProtectedRoute'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/dashboard/analytics"
            element={<AnalyticsPage />}
          />
          <Route
            path="/dashboard/metrics"
            element={<WeeklyMetricsPage />}
          />
          <Route
            path="/dashboard/interventions"
            element={<InterventionsPage />}
          />
        </Route>

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
