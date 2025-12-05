import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
import Pricing from '../pages/Pricing';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import Cookies from '../pages/Cookies';
import AcceptableUse from '../pages/AcceptableUse';
import ECommerce from '../pages/ECommerce';
import Features from '../pages/Features';
import Demo from '../pages/Demo';
import Login from '../pages/Login';
import UserProfile from '../pages/UserProfile';
import Integrations from '../pages/Integrations';
import ComplianceToolkit from '../pages/ComplianceToolkit';

// Lazy loaded public pages
const Profile = lazy(() => import('../pages/account/Profile'));
const Settings = lazy(() => import('../pages/account/Settings'));
const Subscription = lazy(() => import('../pages/account/Subscription'));

export const publicRoutes = [
  { path: '', element: Landing },
  { path: 'pricing', element: Pricing },
  { path: 'features', element: Features },
  { path: 'demo', element: Demo },
  { path: 'integrations', element: Integrations },
  { path: 'login', element: Login },
  { path: 'profile', element: UserProfile },
  { path: 'privacy', element: Privacy },
  { path: 'terms', element: Terms },
  { path: 'cookies', element: Cookies },
  { path: 'acceptable-use', element: AcceptableUse },
  { path: 'ecommerce', element: ECommerce },
  { path: 'products/compliance-toolkit', element: ComplianceToolkit },
  { path: 'account', element: () => <Navigate to="/account/profile" replace /> },
  { path: 'account/profile', element: Profile, lazy: true },
  { path: 'account/settings', element: Settings, lazy: true },
  { path: 'account/subscription', element: Subscription, lazy: true },
];

