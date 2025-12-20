import { lazy } from 'react';

const TemplateStore = lazy(() => import('../pages/monetization/TemplateStore'));
const CreditsManager = lazy(() => import('../pages/monetization/CreditsManager'));
const OneTimeStore = lazy(() => import('../pages/OneTimeStore'));
const PurchaseSuccess = lazy(() => import('../pages/PurchaseSuccess'));
const ActivateLicense = lazy(() => import('../pages/ActivateLicense'));
const Checkout = lazy(() => import('../pages/Checkout'));
const MyDownloads = lazy(() => import('../pages/MyDownloads'));
const PreviewReview = lazy(() => import('../pages/PreviewReview'));

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
];

