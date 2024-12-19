import { Builder, WebDriver, By, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import * as fs from 'fs';
import * as path from 'path';

export class BrowserManager {
  private static instance: BrowserManager;
  private readonly profilesDir: string;

  private constructor() {
    this.profilesDir = path.join(process.cwd(), 'chrome_profiles');
    if (!fs.existsSync(this.profilesDir)) {
      fs.mkdirSync(this.profilesDir, { recursive: true });
    }
  }

  public static getInstance(): BrowserManager {
    if (!BrowserManager.instance) {
      BrowserManager.instance = new BrowserManager();
    }
    return BrowserManager.instance;
  }

  public async createBrowser(accountEmail: string): Promise<WebDriver> {
    const profileDir = path.join(this.profilesDir, accountEmail);
    if (!fs.existsSync(profileDir)) {
      fs.mkdirSync(profileDir, { recursive: true });
    }

    const options = new Options();
    options.addArguments(`--user-data-dir=${profileDir}`);
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.excludeSwitches(['enable-logging', 'enable-automation']);
    options.setUserPreferences({ 'credentials_enable_service': false });

    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.manage().window().maximize();
    return driver;
  }

  public async saveTokens(driver: WebDriver, accountEmail: string): Promise<void> {
    const tokens = {
      localStorage: await driver.executeScript('return Object.entries(localStorage);'),
      sessionStorage: await driver.executeScript('return Object.entries(sessionStorage);'),
      cookies: await driver.manage().getCookies()
    };

    const tokenFile = path.join(this.profilesDir, `${accountEmail}_tokens.json`);
    fs.writeFileSync(tokenFile, JSON.stringify(tokens, null, 2));
  }

  public async loadTokens(driver: WebDriver, accountEmail: string): Promise<boolean> {
    const tokenFile = path.join(this.profilesDir, `${accountEmail}_tokens.json`);
    
    if (!fs.existsSync(tokenFile)) {
      return false;
    }

    const tokens = JSON.parse(fs.readFileSync(tokenFile, 'utf-8'));

    for (const [key, value] of tokens.localStorage) {
      await driver.executeScript(`localStorage.setItem('${key}', '${value}');`);
    }

    for (const [key, value] of tokens.sessionStorage) {
      await driver.executeScript(`sessionStorage.setItem('${key}', '${value}');`);
    }

    for (const cookie of tokens.cookies) {
      await driver.manage().addCookie(cookie);
    }

    return true;
  }

  public async handleLogin(driver: WebDriver, accountEmail: string, url: string): Promise<boolean> {
    await driver.get(url);

    if (await this.loadTokens(driver, accountEmail)) {
      await driver.get(url);
      return true;
    }

    // Wait for manual login and 2FA
    const loginPrompt = await this.showLoginPrompt(accountEmail);
    if (!loginPrompt) {
      return false;
    }

    await this.saveTokens(driver, accountEmail);
    return true;
  }

  private async showLoginPrompt(accountEmail: string): Promise<boolean> {
    // This would be replaced with your UI prompt implementation
    console.log(`Please log in manually for ${accountEmail}`);
    return new Promise(resolve => {
      // Implement your prompt UI here
      resolve(true);
    });
  }
}