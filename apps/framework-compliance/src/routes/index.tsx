import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import LandingLayout from '../components/layout/LandingLayout';
import { publicRoutes } from './publicRoutes';
import { assessmentRoutes } from './assessmentRoutes';
import { toolkitRoutes } from './toolkitRoutes';
import { projectRoutes } from './projectRoutes';
import { resourcesRoutes } from './resourcesRoutes';
import { monetizationRoutes } from './monetizationRoutes';
import { dashboardRoutes } from './dashboardRoutes';
import NotFound from '../pages/NotFound';

// Helper to render route with Suspense if lazy
const renderRoute = (route: any, parentPath = ''): React.ReactNode => {
  // Handle absolute paths (starting with /) - strip leading slash for nested routes
  const normalizedPath = route.path.startsWith('/') ? route.path.slice(1) : route.path;
  const fullPath = parentPath ? `${parentPath}${normalizedPath}` : normalizedPath;
  
  if (route.children) {
    const ParentComponent = route.element;
    return (
      <Route key={fullPath} path={normalizedPath} element={<ParentComponent />}>
        {route.children.map((child: any) => renderRoute(child, fullPath))}
      </Route>
    );
  }

  if (route.lazy) {
    const LazyComponent = route.element;
    return (
      <Route
        key={fullPath}
        path={normalizedPath}
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponent />
          </Suspense>
        }
      />
    );
  }

  const Component = route.element;
  return (
    <Route
      key={fullPath}
      path={normalizedPath}
      element={<Component />}
    />
  );
};

export const AppRoutes: React.FC<{ toggleDarkMode: () => void; darkMode: boolean }> = ({ toggleDarkMode, darkMode }) => {
  return (
    <Routes>
      <Route path="/" element={<LandingLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode} />}>
        {/* Public Routes */}
        {publicRoutes.map(route => renderRoute(route))}
        
        {/* Assessment Routes */}
        {assessmentRoutes.map(route => renderRoute(route))}
        
        {/* Toolkit Routes */}
        {toolkitRoutes.map(route => renderRoute(route))}
        
        {/* Project Routes */}
        {projectRoutes.map(route => renderRoute(route))}
        
        {/* Resources Routes */}
        {resourcesRoutes.map(route => renderRoute(route))}
        
        {/* Monetization Routes */}
        {monetizationRoutes.map(route => renderRoute(route))}
        
        {/* Dashboard Routes */}
        {dashboardRoutes.map(route => renderRoute(route))}
        
        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

