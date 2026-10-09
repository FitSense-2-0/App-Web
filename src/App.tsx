
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import DashboardPage from './features/dashboard/pages/DashboardPage'
import AnalyticsPage from './features/analytics/pages/AnalyticsPage'
import WeeklyMetricsPage from './features/metrics/pages/WeeklyMetricsPage'
import InterventionsPage from './features/interventions/pages/InterventionsPage'
import ParticipantsPage from './features/participants/pages/ParticipantsPage'
import ParticipantDetailPage from './features/participants/pages/ParticipantDetailPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
        <Route path="/dashboard/metrics" element={<WeeklyMetricsPage />} />
        <Route
          path="/dashboard/interventions"
          element={<InterventionsPage />}
        />
        <Route
          path="/dashboard/participants"
          element={<ParticipantsPage />}
        />
        <Route
          path="/dashboard/participants/:participantId"
          element={<ParticipantDetailPage />}
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
