import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

describe('Marketing Site App Smoke Test', () => {
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

