// Security utility functions
export class SecurityUtils {
  /**
   * Sanitize username input to prevent injection attacks
   */
  static sanitizeUsername(username: string): string {
    if (!username || typeof username !== 'string') return '';
    
    // Remove dangerous characters and limit length
    return username
      .trim()
      .slice(0, 12) // OSRS max username length
      .replace(/[<>'"&`]/g, '') // Remove potentially dangerous chars
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  /**
   * Validate external URLs before opening
   */
  static isValidExternalUrl(url: string, allowedDomains: string[]): boolean {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      
      // Check if domain is in allowlist
      return allowedDomains.some(allowed => 
        domain === allowed || domain.endsWith(`.${allowed}`)
      );
    } catch {
      return false;
    }
  }

  /**
   * Safely open external URLs
   */
  static safeOpenUrl(url: string, allowedDomains: string[] = ['youtube.com', 'youtu.be']): boolean {
    if (!this.isValidExternalUrl(url, allowedDomains)) {
      console.warn('Blocked attempt to open unsafe URL:', url);
      return false;
    }

    try {
      window.open(url, '_blank', 'noopener,noreferrer');
      return true;
    } catch (error) {
      console.error('Failed to open URL safely:', error);
      return false;
    }
  }

  /**
   * Safe localStorage operations with error handling
   */
  static setLocalStorage(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Failed to set localStorage:', error);
      return false;
    }
  }

  static getLocalStorage(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Failed to get localStorage:', error);
      return null;
    }
  }

  /**
   * Production-safe logging
   */
  static log(message: string, data?: any): void {
    if (import.meta.env.DEV) {
      console.log(message, data);
    }
  }

  static warn(message: string, data?: any): void {
    if (import.meta.env.DEV) {
      console.warn(message, data);
    }
  }

  static error(message: string, error?: any): void {
    // Always log errors, but sanitize in production
    if (import.meta.env.DEV) {
      console.error(message, error);
    } else {
      console.error(message);
    }
  }
}
