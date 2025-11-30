import { lazy } from 'react';
import { lazyWithRetry } from '../utils/common';

const PrivacyProjectDashboard = lazyWithRetry(
  () => import('../pages/project/PrivacyProjectDashboard'),
  {
    maxRetries: 3,
    retryDelay: 1000,
    onError: (error, retryCount) => {
      console.warn(`PrivacyProjectDashboard import failed (retry ${retryCount}):`, error);
    }
  }
);
const PrivacyRoadmap = lazy(() => import('../pages/project/PrivacyRoadmap'));
const PrivacyRaci = lazy(() => import('../pages/project/PrivacyRaci'));
const PrivacyWbs = lazy(() => import('../pages/project/PrivacyWbs'));
const EvidenceVault = lazy(() => import('../pages/project/EvidenceVault'));

export const projectRoutes = [
  {
    path: 'project',
    element: PrivacyProjectDashboard,
    lazy: true,
  },
  {
    path: 'project/roadmap',
    element: PrivacyRoadmap,
    lazy: true,
  },
  {
    path: 'project/raci',
    element: PrivacyRaci,
    lazy: true,
  },
  {
    path: 'project/wbs',
    element: PrivacyWbs,
    lazy: true,
  },
  {
    path: 'project/evidence',
    element: EvidenceVault,
    lazy: true,
  },
];

