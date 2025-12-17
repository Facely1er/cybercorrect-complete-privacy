import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import AssessmentLayout from '../components/layout/AssessmentLayout';
import { lazyWithRetry } from '../utils/common';

// Assessment Hub
const AssessmentHub = lazy(() => import('../pages/AssessmentHub'));

// Assessment Tools
const PrivacyAssessment = lazy(() => import('../pages/tools-and-assessments/PrivacyAssessment'));
const PrivacyResults = lazy(() => import('../pages/tools-and-assessments/PrivacyResults'));
const PrivacyResultsOrganizational = lazy(() => import('../pages/tools-and-assessments/PrivacyResultsOrganizational'));
const PrivacyRecommendations = lazy(() => import('../pages/tools-and-assessments/PrivacyRecommendations'));

// Collaborative Assessments
const CollaborativeAssessment = lazy(() => import('../pages/assessments/CollaborativeAssessment'));

// Scheduled Assessments
const ScheduledAssessments = lazy(() => import('../pages/assessments/ScheduledAssessments'));

export const assessmentRoutes = [
  {
    path: 'assessment',
    element: AssessmentHub,
    lazy: true,
  },
  // Legacy redirect
  {
    path: 'assessment-hub',
    element: () => <Navigate to="/assessment" replace />,
  },
  {
    path: 'assessments',
    element: AssessmentLayout,
    children: [
      { path: '', element: () => <Navigate to="/assessment" replace /> },
      {
        path: 'privacy-assessment',
        element: PrivacyAssessment,
        lazy: true,
      },
      {
        path: 'collaborative',
        element: CollaborativeAssessment,
        lazy: true,
      },
    ],
  },
  // Collaborative assessment with session ID
  {
    path: 'assessment/collaborate/:sessionId',
    element: PrivacyAssessment,
    lazy: true,
  },
  {
    path: 'privacy-results',
    element: PrivacyResults,
    lazy: true,
  },
  {
    path: 'privacy-results/organizational',
    element: PrivacyResultsOrganizational,
    lazy: true,
  },
  {
    path: 'privacy-recommendations',
    element: PrivacyRecommendations,
    lazy: true,
  },
  {
    path: '/assessments/scheduled',
    element: ScheduledAssessments,
    lazy: true,
  },
];

