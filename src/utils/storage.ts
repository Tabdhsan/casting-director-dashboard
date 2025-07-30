// localStorage utility with error handling

import { ERROR_MESSAGES } from '@/types/constants';

export interface StorageError {
  type: 'quota_exceeded' | 'unavailable' | 'corrupted' | 'unknown';
  message: string;
  originalError?: Error;
}

export class StorageManager {
  private static isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private static getStorageSize(): number {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  static setItem(key: string, value: string): StorageError | null {
    if (!this.isAvailable()) {
      return {
        type: 'unavailable',
        message: ERROR_MESSAGES.STORAGE_UNAVAILABLE,
      };
    }

    try {
      // Check if we're approaching quota (5MB limit)
      const currentSize = this.getStorageSize();
      const newItemSize = key.length + value.length;
      
      if (currentSize + newItemSize > 5 * 1024 * 1024) { // 5MB
        return {
          type: 'quota_exceeded',
          message: ERROR_MESSAGES.STORAGE_QUOTA_EXCEEDED,
        };
      }

      localStorage.setItem(key, value);
      return null;
    } catch (error) {
      const err = error as Error;
      
      if (err.name === 'QuotaExceededError') {
        return {
          type: 'quota_exceeded',
          message: ERROR_MESSAGES.STORAGE_QUOTA_EXCEEDED,
          originalError: err,
        };
      }
      
      if (err.name === 'SecurityError') {
        return {
          type: 'unavailable',
          message: ERROR_MESSAGES.STORAGE_UNAVAILABLE,
          originalError: err,
        };
      }

      return {
        type: 'unknown',
        message: 'Failed to save data to storage.',
        originalError: err,
      };
    }
  }

  static getItem(key: string): { value: string | null; error: StorageError | null } {
    if (!this.isAvailable()) {
      return {
        value: null,
        error: {
          type: 'unavailable',
          message: ERROR_MESSAGES.STORAGE_UNAVAILABLE,
        },
      };
    }

    try {
      const value = localStorage.getItem(key);
      return { value, error: null };
    } catch (error) {
      const err = error as Error;
      return {
        value: null,
        error: {
          type: 'corrupted',
          message: 'Failed to read data from storage.',
          originalError: err,
        },
      };
    }
  }

  static removeItem(key: string): StorageError | null {
    if (!this.isAvailable()) {
      return {
        type: 'unavailable',
        message: ERROR_MESSAGES.STORAGE_UNAVAILABLE,
      };
    }

    try {
      localStorage.removeItem(key);
      return null;
    } catch (error) {
      const err = error as Error;
      return {
        type: 'unknown',
        message: 'Failed to remove data from storage.',
        originalError: err,
      };
    }
  }

  static clear(): StorageError | null {
    if (!this.isAvailable()) {
      return {
        type: 'unavailable',
        message: ERROR_MESSAGES.STORAGE_UNAVAILABLE,
      };
    }

    try {
      localStorage.clear();
      return null;
    } catch (error) {
      const err = error as Error;
      return {
        type: 'unknown',
        message: 'Failed to clear storage.',
        originalError: err,
      };
    }
  }

  static getStorageInfo(): { available: boolean; used: number; quota: number } {
    const available = this.isAvailable();
    const used = available ? this.getStorageSize() : 0;
    const quota = 5 * 1024 * 1024; // 5MB estimate
    
    return { available, used, quota };
  }

  static validateData(data: any): { isValid: boolean; error?: string } {
    try {
      // Basic validation - check if it's an object
      if (typeof data !== 'object' || data === null) {
        return { isValid: false, error: 'Data is not a valid object' };
      }

      // Check for required properties if it's our app data
      if (data.actors !== undefined && !Array.isArray(data.actors)) {
        return { isValid: false, error: 'Actors data is not an array' };
      }

      if (data.projects !== undefined && !Array.isArray(data.projects)) {
        return { isValid: false, error: 'Projects data is not an array' };
      }

      if (data.roles !== undefined && !Array.isArray(data.roles)) {
        return { isValid: false, error: 'Roles data is not an array' };
      }

      if (data.assignments !== undefined && !Array.isArray(data.assignments)) {
        return { isValid: false, error: 'Assignments data is not an array' };
      }

      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: 'Data validation failed' };
    }
  }
} 