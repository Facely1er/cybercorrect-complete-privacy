// Service Worker registration and management
import { environment } from '../config/environment';
import { logger } from '../utils/logger';

interface ServiceWorkerMessage {
  type: string;
  payload?: unknown;
}

class ServiceWorkerService {
  private registration: ServiceWorkerRegistration | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = 'serviceWorker' in navigator;
  }

  async register(): Promise<boolean> {
    if (!this.isSupported) {
      logger.debug('Service Worker not supported');
      return false;
    }

    if (!environment.production) {
      logger.debug('Service Worker disabled in development');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      logger.info('Service Worker registered successfully');

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, notify user
              this.notifyUpdateAvailable();
            }
          });
        }
      });

      // Handle messages from service worker
      navigator.serviceWorker.addEventListener('message', this.handleMessage.bind(this));

      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const result = await this.registration.unregister();
      logger.info('Service Worker unregistered');
      return result;
    } catch (error) {
      logger.error('Service Worker unregistration failed:', error);
      return false;
    }
  }

  async update(): Promise<void> {
    if (!this.registration) {
      return;
    }

    try {
      await this.registration.update();
      logger.info('Service Worker update requested');
    } catch (error) {
      logger.error('Service Worker update failed:', error);
    }
  }

  async clearCaches(): Promise<void> {
    if (!this.isSupported) {
      return;
    }

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name.startsWith('cybercorrect-'))
          .map(name => caches.delete(name))
      );
      logger.info('Caches cleared');
    } catch (error) {
      logger.error('Cache clearing failed:', error);
    }
  }

  async getCacheSize(): Promise<number> {
    if (!this.isSupported) {
      return 0;
    }

    try {
      const cacheNames = await caches.keys();
      let totalSize = 0;

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        for (const request of keys) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }
      }

      return totalSize;
    } catch (error) {
      logger.error('Cache size calculation failed:', error);
      return 0;
    }
  }

  private handleMessage(event: MessageEvent<ServiceWorkerMessage>): void {
    const { type, payload } = event.data;

    switch (type) {
      case 'CACHE_UPDATED':
        logger.debug('Cache updated:', payload);
        break;
      case 'OFFLINE_DETECTED':
        logger.info('Offline mode detected');
        this.notifyOfflineStatus(true);
        break;
      case 'ONLINE_DETECTED':
        logger.info('Online mode detected');
        this.notifyOfflineStatus(false);
        break;
      default:
        logger.debug('Unknown message from Service Worker:', type, payload);
    }
  }

  private notifyUpdateAvailable(): void {
    // Dispatch custom event for update notification
    const event = new CustomEvent('sw-update-available', {
      detail: { registration: this.registration }
    });
    window.dispatchEvent(event);
  }

  private notifyOfflineStatus(isOffline: boolean): void {
    // Dispatch custom event for offline status
    const event = new CustomEvent('sw-offline-status', {
      detail: { isOffline }
    });
    window.dispatchEvent(event);
  }

  // Send message to service worker
  async sendMessage(message: ServiceWorkerMessage): Promise<void> {
    if (!this.registration?.active) {
      logger.warn('No active service worker to send message to');
      return;
    }

    try {
      this.registration.active.postMessage(message);
    } catch (error) {
      logger.error('Failed to send message to service worker:', error);
    }
  }

  // Check if service worker is controlling the page
  isControlling(): boolean {
    return !!navigator.serviceWorker.controller;
  }

  // Get registration status
  getStatus(): 'registered' | 'installing' | 'activated' | 'redundant' | 'unregistered' {
    if (!this.registration) {
      return 'unregistered';
    }

    if (this.registration.installing) {
      return 'installing';
    }

    if (this.registration.waiting) {
      return 'activated';
    }

    if (this.registration.active) {
      return 'activated';
    }

    return 'redundant';
  }

  // Force update and reload
  async forceUpdate(): Promise<void> {
    if (!this.registration) {
      return;
    }

    try {
      // Skip waiting and reload
      if (this.registration.waiting) {
        this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      // Listen for controlling service worker change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    } catch (error) {
      logger.error('Force update failed:', error);
    }
  }
}

// Export singleton instance
export const serviceWorkerService = new ServiceWorkerService();

// Auto-register in production
if (environment.production && typeof window !== 'undefined') {
  // Register after a short delay to avoid blocking initial page load
  setTimeout(() => {
    serviceWorkerService.register();
  }, 1000);
}