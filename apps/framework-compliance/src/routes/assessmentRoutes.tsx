import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import AssessmentLayout from '../components/layout/AssessmentLayout';
import { lazyWithRetry } from '../utils/common';

// Assessment Hub
const AssessmentHub = lazy(() => import('../pages/AssessmentHub'));

// Assessment Tools
const PrivacyAssessment = lazy(() => import('../pages/tools-and-assessments/PrivacyAssessment'));
const PrivacyResults = lazy(() => import('../pages/tools-and-assessments/PrivacyResults'));
const PrivacyRecommendations = lazy(() => import('../pages/tools-and-assessments/PrivacyRecommendations'));

// Scheduled Assessments
const ScheduledAssessments = lazy(() => import('../pages/assessments/ScheduledAssessments'));

export const assessmentRoutes = [
  {
    path: 'assessment-hub',
    element: AssessmentHub,
    lazy: true,
  },
  {
    path: 'assessments',
    element: AssessmentLayout,
    children: [
      { path: '', element: () => <Navigate to="/assessment-hub" replace /> },
      {
        path: 'privacy-assessment',
        element: PrivacyAssessment,
        lazy: true,
      },
    ],
  },
  {
    path: 'privacy-results',
    element: PrivacyResults,
    lazy: true,
  },
  {
    path: 'privacy-recommendations',
    element: PrivacyRecommendations,
    lazy: true,
  },
  {
    path: 'assessments/scheduled',
    element: ScheduledAssessments,
    lazy: true,
  },
];

