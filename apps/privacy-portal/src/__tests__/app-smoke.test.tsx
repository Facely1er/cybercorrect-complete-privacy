import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock services
vi.mock('../services/sentryService', () => ({
  initializeSentry: vi.fn(),
}));

vi.mock('../services/errorReportingService', () => ({
  errorReportingService: {
    logError: vi.fn(),
  },
}));

vi.mock('../services/monitoringService', () => ({
  monitoringService: {
    trackError: vi.fn(),
    trackPageView: vi.fn(),
    trackEvent: vi.fn(),
  },
}));

describe('Privacy Portal App Smoke Test', () => {
  it('should render the app without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // App should render without throwing
    expect(document.body).toBeTruthy();
  });

  it('should have a root element', () => {
    const root = document.getElementById('root');
    expect(root).toBeTruthy();
  });
});

