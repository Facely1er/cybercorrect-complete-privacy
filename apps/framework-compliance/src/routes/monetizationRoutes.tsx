import { lazy } from 'react';

const TemplateStore = lazy(() => import('../pages/monetization/TemplateStore'));
const CreditsManager = lazy(() => import('../pages/monetization/CreditsManager'));
const OneTimeStore = lazy(() => import('../pages/OneTimeStore'));
const PurchaseSuccess = lazy(() => import('../pages/PurchaseSuccess'));
const ActivateLicense = lazy(() => import('../pages/ActivateLicense'));
const Checkout = lazy(() => import('../pages/Checkout'));
const MyDownloads = lazy(() => import('../pages/MyDownloads'));
const PreviewReview = lazy(() => import('../pages/PreviewReview'));
const PreviewArtifactViewer = lazy(() => import('../pages/PreviewArtifactViewer'));

// Artifact Pages
const ArtifactsIndex = lazy(() => import('../pages/artifacts/ArtifactsIndex'));
const DpiaGeneratorArtifact = lazy(() => import('../pages/artifacts/DpiaGeneratorArtifact'));
const BreachNotificationArtifact = lazy(() => import('../pages/artifacts/BreachNotificationArtifact'));

export const monetizationRoutes = [
  {
    path: '/monetization/templates',
    element: TemplateStore,
    lazy: true,
  },
  {
    path: '/monetization/credits',
    element: CreditsManager,
    lazy: true,
  },
  {
    path: 'store',
    element: OneTimeStore,
    lazy: true,
  },
  {
    path: 'one-time-products',
    element: OneTimeStore,
    lazy: true,
  },
  {
    path: 'products',
    element: OneTimeStore,
    lazy: true,
  },
  {
    path: 'checkout',
    element: Checkout,
    lazy: true,
  },
  {
    path: '/store/success',
    element: PurchaseSuccess,
    lazy: true,
  },
  {
    path: 'activate-license',
    element: ActivateLicense,
    lazy: true,
  },
  {
    path: 'my-downloads',
    element: MyDownloads,
    lazy: true,
  },
  {
    path: 'downloads',
    element: MyDownloads,
    lazy: true,
  },
  {
    path: 'preview-review',
    element: PreviewReview,
    lazy: true,
  },
  {
    path: '/preview-review',
    element: PreviewReview,
    lazy: true,
  },
  {
    path: 'preview-artifact/:productId',
    element: PreviewArtifactViewer,
    lazy: true,
  },
  {
    path: 'preview-artifact/:productId/:previewIndex',
    element: PreviewArtifactViewer,
    lazy: true,
  },
  // Artifact Document Pages
  {
    path: 'artifacts',
    element: ArtifactsIndex,
    lazy: true,
  },
  {
    path: '/artifacts',
    element: ArtifactsIndex,
    lazy: true,
  },
  {
    path: 'artifacts/dpia-generator',
    element: DpiaGeneratorArtifact,
    lazy: true,
  },
  {
    path: '/artifacts/dpia-generator',
    element: DpiaGeneratorArtifact,
    lazy: true,
  },
  {
    path: 'artifacts/breach-notification',
    element: BreachNotificationArtifact,
    lazy: true,
  },
  {
    path: '/artifacts/breach-notification',
    element: BreachNotificationArtifact,
    lazy: true,
  },
];

