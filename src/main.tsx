import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { initSentry, SentryErrorBoundary } from './lib/sentry';

// Initialize Sentry before anything else
initSentry();

// Global error handler to catch undefined run errors
window.addEventListener('error', (event) => {
  if (event.error && event.error.message && event.error.message.includes('Cannot read properties of undefined (reading \'run\')')) {
    console.warn('Caught undefined run error, preventing crash:', event.error);
    event.preventDefault();
    return false;
  }
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('Cannot read properties of undefined (reading \'run\')')) {
    console.warn('Caught undefined run promise rejection, preventing crash:', event.reason);
    event.preventDefault();
    return false;
  }
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SentryErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SentryErrorBoundary>
  </React.StrictMode>
);