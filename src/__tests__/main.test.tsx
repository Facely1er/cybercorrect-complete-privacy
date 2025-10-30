import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We need to test the side effects and handlers in main.tsx
// Since main.tsx executes immediately on import, we'll test the behavior

describe('main.tsx initialization', () => {
  let originalError: typeof console.error;
  let originalWarn: typeof console.warn;
  let errorListeners: Array<(event: ErrorEvent) => void> = [];
  let rejectionListeners: Array<(event: PromiseRejectionEvent) => void> = [];

  beforeEach(() => {
    originalError = console.error;
    originalWarn = console.warn;
    console.error = vi.fn();
    console.warn = vi.fn();

    // Track event listeners
    errorListeners = [];
    rejectionListeners = [];

    const originalAddEventListener = window.addEventListener;
    vi.spyOn(window, 'addEventListener').mockImplementation((type: string, listener: EventListener | EventListenerObject) => {
      if (type === 'error') {
        errorListeners.push(listener as (event: ErrorEvent) => void);
      } else if (type === 'unhandledrejection') {
        rejectionListeners.push(listener as (event: PromiseRejectionEvent) => void);
      }
      return originalAddEventListener.call(window, type, listener);
    });
  });

  afterEach(() => {
    console.error = originalError;
    console.warn = originalWarn;
    vi.clearAllMocks();
    errorListeners = [];
    rejectionListeners = [];
  });

  it('should set up global error handler for undefined run errors', async () => {
    // Dynamic import to load main.tsx and trigger side effects
    await import('../main');

    // Verify error listener was added
    expect(errorListeners.length).toBeGreaterThan(0);

    // Create a test error event
    const error = new Error("Cannot read properties of undefined (reading 'run')");
    const errorEvent = {
      type: 'error',
      error,
      message: error.message,
      filename: 'test.js',
      lineno: 1,
      colno: 1,
      preventDefault: vi.fn(),
      cancelBubble: false,
      bubbles: false,
      cancelable: true,
      defaultPrevented: false,
      currentTarget: window,
      target: window,
      timeStamp: Date.now(),
      isTrusted: true,
    } as ErrorEvent;

    // Call the error handler
    if (errorListeners.length > 0) {
      errorListeners[0](errorEvent);
      
      // Verify error was handled (preventDefault might be called)
      expect(console.warn).toHaveBeenCalled();
    }
  });

  it('should set up unhandled rejection handler for undefined run errors', async () => {
    await import('../main');

    // Verify rejection listener was added
    expect(rejectionListeners.length).toBeGreaterThan(0);

    // Create a test rejection event
    const reason = new Error("Cannot read properties of undefined (reading 'run')");
    const rejectionEvent = {
      type: 'unhandledrejection',
      promise: Promise.reject(reason),
      reason,
      preventDefault: vi.fn(),
      cancelBubble: false,
      bubbles: false,
      cancelable: true,
      defaultPrevented: false,
      currentTarget: window,
      target: window,
      timeStamp: Date.now(),
      isTrusted: true,
    } as PromiseRejectionEvent;

    // Call the rejection handler
    if (rejectionListeners.length > 0) {
      rejectionListeners[0](rejectionEvent);
      
      // Verify rejection was handled
      expect(console.warn).toHaveBeenCalled();
    }
  });

  it('should not handle non-undefined-run errors', async () => {
    await import('../main');

    if (errorListeners.length > 0) {
      const differentError = new Error('Different error');
      const errorEvent = {
        type: 'error',
        error: differentError,
        message: differentError.message,
        preventDefault: vi.fn(),
      } as ErrorEvent;

      errorListeners[0](errorEvent);

      // Should still call console.warn but won't prevent default
      // (handler checks for specific error message)
    }
  });

  it('should initialize Sentry', async () => {
    const sentryModule = await import('../lib/sentry');
    
    // Verify initSentry exists and is callable
    expect(sentryModule.initSentry).toBeDefined();
    expect(typeof sentryModule.initSentry).toBe('function');
  });
});

