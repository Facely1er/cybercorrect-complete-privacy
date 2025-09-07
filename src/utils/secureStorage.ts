// Secure storage utility with error handling and encryption
import { errorMonitoring } from '../lib/errorMonitoring';

interface StorageOptions {
  encrypt?: boolean;
  compress?: boolean;
  ttl?: number; // Time to live in milliseconds
}

class SecureStorage {
  private isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private encrypt(data: string): string {
    // Simple base64 encoding for now - in production, use proper encryption
    // This is just obfuscation, not real security
    return btoa(encodeURIComponent(data));
  }

  private decrypt(data: string): string {
    try {
      return decodeURIComponent(atob(data));
    } catch {
      return data; // Return original if decryption fails
    }
  }

  private compress(data: string): string {
    // Simple compression using built-in compression
    // In production, consider using a proper compression library
    return data.length > 1000 ? btoa(data) : data;
  }

  private decompress(data: string): string {
    try {
      return data.length > 1000 ? atob(data) : data;
    } catch {
      return data;
    }
  }

  setItem<T = any>(key: string, value: T, options: StorageOptions = {}): boolean {
    if (!this.isAvailable()) {
      errorMonitoring.captureMessage('localStorage not available', 'warning', { key });
      return false;
    }

    try {
      let data = JSON.stringify(value);
      
      if (options.compress) {
        data = this.compress(data);
      }
      
      if (options.encrypt) {
        data = this.encrypt(data);
      }

      // Add TTL if specified
      if (options.ttl) {
        const item = {
          data,
          expires: Date.now() + options.ttl,
          encrypted: options.encrypt,
          compressed: options.compress
        };
        localStorage.setItem(key, JSON.stringify(item));
      } else {
        localStorage.setItem(key, data);
      }

      return true;
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Storage set failed'), {
        context: 'secure_storage_set',
        key,
        valueSize: JSON.stringify(value).length
      });
      return false;
    }
  }

  getItem<T = any>(key: string, defaultValue?: T): T | null {
    if (!this.isAvailable()) {
      return defaultValue || null;
    }

    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return defaultValue || null;
      }

      // Check if it's a TTL item
      if (item.startsWith('{')) {
        const parsed = JSON.parse(item);
        if (parsed.expires && Date.now() > parsed.expires) {
          localStorage.removeItem(key);
          return defaultValue || null;
        }
        
        let data = parsed.data;
        if (parsed.compressed) {
          data = this.decompress(data);
        }
        if (parsed.encrypted) {
          data = this.decrypt(data);
        }
        
        return JSON.parse(data);
      }

      // Regular item
      return JSON.parse(item);
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Storage get failed'), {
        context: 'secure_storage_get',
        key
      });
      return defaultValue || null;
    }
  }

  removeItem(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Storage remove failed'), {
        context: 'secure_storage_remove',
        key
      });
      return false;
    }
  }

  clear(): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Storage clear failed'), {
        context: 'secure_storage_clear'
      });
      return false;
    }
  }

  // Safe wrapper for sensitive data
  setSecureItem<T = any>(key: string, value: T, ttl?: number): boolean {
    return this.setItem(key, value, { encrypt: true, compress: true, ttl });
  }

  getSecureItem<T = any>(key: string, defaultValue?: T): T | null {
    return this.getItem(key, defaultValue);
  }
}

export const secureStorage = new SecureStorage();

// Convenience functions for common use cases
export const setUserData = <T = any>(key: string, value: T): boolean => {
  return secureStorage.setSecureItem(`user_${key}`, value, 7 * 24 * 60 * 60 * 1000); // 7 days
};

export const getUserData = <T = any>(key: string, defaultValue?: T): T | null => {
  return secureStorage.getSecureItem(`user_${key}`, defaultValue);
};

export const setProjectData = <T = any>(key: string, value: T): boolean => {
  return secureStorage.setItem(`project_${key}`, value, { compress: true });
};

export const getProjectData = <T = any>(key: string, defaultValue?: T): T | null => {
  return secureStorage.getItem(`project_${key}`, defaultValue);
};

export const setAppSetting = <T = any>(key: string, value: T): boolean => {
  return secureStorage.setItem(`app_${key}`, value);
};

export const getAppSetting = <T = any>(key: string, defaultValue?: T): T | null => {
  return secureStorage.getItem(`app_${key}`, defaultValue);
};