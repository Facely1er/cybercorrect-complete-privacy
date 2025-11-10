import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { initSentry, SentryErrorBoundary } from './lib/sentry';

// Initialize Sentry before anything else
initSentry();

// Global error handler to catch undefined run errors and dynamic import failures
window.addEventListener('error', (event) => {
  if (event.error && event.error.message) {
    // Handle undefined run errors
    if (event.error.message.includes('Cannot read properties of undefined (reading \'run\')')) {
      console.warn('Caught undefined run error, preventing crash:', event.error);
      event.preventDefault();
      return false;
    }
    
    // Handle dynamic import/chunk load errors
    if (
      event.error.message.includes('Failed to fetch dynamically imported module') ||
      event.error.message.includes('Loading chunk') ||
      event.error.name === 'ChunkLoadError'
    ) {
      console.warn('Caught dynamic import error:', event.error);
      // Don't prevent default - let ErrorBoundary handle it
      // But log for monitoring
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(event.error, {
          tags: { errorType: 'dynamic_import_global' }
        });
      }
    }
  }
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason) {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
    
    // Handle undefined run promise rejections
    if (error.message.includes('Cannot read properties of undefined (reading \'run\')')) {
      console.warn('Caught undefined run promise rejection, preventing crash:', event.reason);
      event.preventDefault();
      return false;
    }
    
    // Handle dynamic import promise rejections
    if (
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Loading chunk') ||
      error.name === 'ChunkLoadError'
    ) {
      console.warn('Caught dynamic import promise rejection:', error);
      // Don't prevent default - let retry logic handle it
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(error, {
          tags: { errorType: 'dynamic_import_promise' }
        });
      }
    }
  }
});

// Handle GitHub Pages redirects (for direct URL access)
const urlParams = new URLSearchParams(window.location.search);
const redirect = urlParams.get('redirect');
if (redirect && redirect !== '/') {
  window.history.replaceState({}, '', redirect);
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <SentryErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SentryErrorBoundary>
    </React.StrictMode>
  );
}