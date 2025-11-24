import { ComponentType, LazyExoticComponent } from 'react';

export interface RouteConfig {
  path: string;
  element: ComponentType<any> | LazyExoticComponent<ComponentType<any>>;
  children?: RouteConfig[];
}

export interface LazyRouteConfig {
  path: string;
  lazyComponent: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ComponentType;
}

