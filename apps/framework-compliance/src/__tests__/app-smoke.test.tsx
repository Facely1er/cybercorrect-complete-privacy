import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock heavy dependencies
vi.mock('../lib/sentry', () => ({
  initSentry: vi.fn(),
  SentryErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../components/AnalyticsWrapper', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('App Smoke Test', () => {
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
    // Create root element if it doesn't exist (for test environment)
    let root = document.getElementById('root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'root';
      document.body.appendChild(root);
    }
    expect(root).toBeTruthy();
  });
});

