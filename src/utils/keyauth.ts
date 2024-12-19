import { api } from 'keyauth';

export class KeyAuthManager {
  private static instance: KeyAuthManager;
  private keyauth: any;
  private initialized = false;

  private constructor() {
    this.keyauth = new api(
      "HydraV1",
      "fV0uvYnrch",
      "1.0",
      this.getChecksum()
    );
  }

  public static getInstance(): KeyAuthManager {
    if (!KeyAuthManager.instance) {
      KeyAuthManager.instance = new KeyAuthManager();
    }
    return KeyAuthManager.instance;
  }

  private getChecksum(): string {
    // Implement checksum logic here
    return '';
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      await this.keyauth.init();
      this.initialized = true;
    } catch (error) {
      console.error('KeyAuth initialization failed:', error);
      throw error;
    }
  }

  public async validateLicense(key: string): Promise<boolean> {
    try {
      await this.keyauth.license(key);
      return true;
    } catch (error) {
      console.error('License validation failed:', error);
      return false;
    }
  }

  public async checkSession(): Promise<boolean> {
    try {
      return await this.keyauth.check();
    } catch (error) {
      console.error('Session check failed:', error);
      return false;
    }
  }
}