import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import AssessmentLayout from '../components/layout/AssessmentLayout';

// Assessment Hub
const AssessmentHub = lazy(() => import('../pages/AssessmentHub'));

// Assessment Tools
const PrivacyAssessment = lazy(() => import('../pages/tools-and-assessments/PrivacyAssessment'));

// Gap Analyzer (shows results and recommendations)
const PrivacyGapAnalyzer = lazy(() => import('../pages/tools-and-assessments/PrivacyGapAnalyzer'));

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
  // Results now redirect to Gap Analyzer (which displays results and recommendations)
  {
    path: 'privacy-results',
    element: () => <Navigate to="/toolkit/privacy-gap-analyzer" replace />,
  },
  {
    path: 'privacy-results/organizational',
    element: () => <Navigate to="/toolkit/privacy-gap-analyzer" replace />,
  },
  {
    path: 'privacy-recommendations',
    element: () => <Navigate to="/toolkit/privacy-gap-analyzer" replace />,
  },
  {
    path: '/assessments/scheduled',
    element: ScheduledAssessments,
    lazy: true,
  },
];
