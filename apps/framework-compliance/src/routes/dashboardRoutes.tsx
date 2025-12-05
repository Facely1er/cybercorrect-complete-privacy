import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const NotificationCenter = lazy(() => import('../components/notifications/NotificationCenter'));
const ComplianceHealthDashboard = lazy(() => import('../pages/dashboard/ComplianceHealthDashboard'));
const AutomatedReports = lazy(() => import('../pages/reports/AutomatedReports'));
const AlertManagement = lazy(() => import('../pages/alerts/AlertManagement'));
const RegulatoryIntelligence = lazy(() => import('../pages/regulatory/RegulatoryIntelligence'));
const ProgressTracking = lazy(() => import('../pages/dashboard/ProgressTracking'));

export const dashboardRoutes = [
  {
    path: 'notifications',
    element: NotificationCenter,
    lazy: true,
  },
  {
    path: 'compliance',
    element: () => <Navigate to="/dashboard/compliance-health" replace />,
  },
  {
    path: 'dashboard',
    element: () => <Navigate to="/dashboard/compliance-health" replace />,
  },
  {
    path: '/dashboard/compliance-health',
    element: ComplianceHealthDashboard,
    lazy: true,
  },
  {
    path: 'reports',
    element: () => <Navigate to="/reports/automated" replace />,
  },
  {
    path: '/reports/automated',
    element: AutomatedReports,
    lazy: true,
  },
  {
    path: 'alerts',
    element: AlertManagement,
    lazy: true,
  },
  {
    path: 'regulatory',
    element: RegulatoryIntelligence,
    lazy: true,
  },
  {
    path: '/dashboard/progress',
    element: ProgressTracking,
    lazy: true,
  },
];

