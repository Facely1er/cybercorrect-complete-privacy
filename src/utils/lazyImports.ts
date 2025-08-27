import { lazy } from 'react';

// Lazy load heavy components for better performance
export const LazyComplianceGapAnalyzer = lazy(() => import('../pages/tools-and-assessments/ComplianceGapAnalyzer'));
export const LazyPolicyGenerator = lazy(() => import('../pages/tools-and-assessments/PolicyGenerator'));
export const LazyCuiMapper = lazy(() => import('../pages/tools-and-assessments/CuiMapper'));
export const LazyGdprMapper = lazy(() => import('../pages/tools-and-assessments/GdprMapper'));

// Lazy load documentation pages
export const LazyGdprGuide = lazy(() => import('../pages/resources/documentation/GdprGuide'));
export const LazyNist800171Guide = lazy(() => import('../pages/resources/documentation/Nist800171Guide'));
export const LazyCmmc20Guide = lazy(() => import('../pages/resources/documentation/Cmmc20Guide'));

// Lazy load guide pages
export const LazyNistCsfGuide = lazy(() => import('../pages/resources/guides/NistCsfGuide'));
export const LazyRansomwareGuide = lazy(() => import('../pages/resources/guides/RansomwareGuide'));
export const LazySupplyChainGuide = lazy(() => import('../pages/resources/guides/SupplyChainGuide'));