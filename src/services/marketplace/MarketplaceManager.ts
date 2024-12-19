import { WebDriver, By, until } from 'selenium-webdriver';
import { BrowserManager } from '../browser/BrowserManager';
import { Logger } from '../utils/Logger';

interface Account {
  email: string;
  status: 'main' | 'sub';
  driver?: WebDriver;
}

interface PurchaseConfig {
  itemCode: string;
  subPurchase: number;
  mainPurchase: number;
}

export class MarketplaceManager {
  private static instance: MarketplaceManager;
  private browserManager: BrowserManager;
  private logger: Logger;
  private confirmedAccounts: Account[] = [];
  private ownedAccounts: Account[] = [];
  private saleOrdersValue: number | null = null;

  private constructor() {
    this.browserManager = BrowserManager.getInstance();
    this.logger = new Logger();
  }

  public static getInstance(): MarketplaceManager {
    if (!MarketplaceManager.instance) {
      MarketplaceManager.instance = new MarketplaceManager();
    }
    return MarketplaceManager.instance;
  }

  public async processPurchase(accounts: Account[], config: PurchaseConfig) {
    const url = `https://www.ubisoft.com/en-gb/game/rainbow-six/siege/marketplace?route=buy/item-details&itemId=${config.itemCode}`;

    for (const account of accounts) {
      try {
        account.driver = await this.browserManager.createBrowser(account.email);
        await this.browserManager.handleLogin(account.driver, account.email, url);
        await this.preparePurchase(account, config);
      } catch (error) {
        this.logger.error(`Failed to process account ${account.email}:`, error);
      }
    }

    return {
      saleOrders: this.saleOrdersValue,
      confirmedAccounts: this.confirmedAccounts.map(acc => acc.email),
      ownedAccounts: this.ownedAccounts.map(acc => acc.email)
    };
  }

  private async preparePurchase(account: Account, config: PurchaseConfig) {
    const driver = account.driver!;
    
    try {
      // Switch to marketplace iframe
      const iframe = await driver.wait(until.elementLocated(By.css(
        "#app > div.r6s-marketplace.undefined > div > div > ubisoft-connect"
      )), 15000);
      await driver.switchTo().frame(iframe);

      // Get sale orders value if not already set
      if (this.saleOrdersValue === null) {
        const saleOrdersElement = await driver.wait(
          until.elementLocated(By.css('.sale-orders')),
          15000
        );
        this.saleOrdersValue = parseInt(await saleOrdersElement.getText().replace(',', ''));
      }

      // Set purchase value
      try {
        const priceInput = await driver.wait(
          until.elementLocated(By.css('input[type="number"]')),
          15000
        );
        await priceInput.clear();
        await priceInput.sendKeys(
          account.status === 'main' ? config.mainPurchase.toString() : config.subPurchase.toString()
        );
        this.confirmedAccounts.push(account);
      } catch {
        this.ownedAccounts.push(account);
      }
    } catch (error) {
      this.logger.error(`Failed to prepare purchase for ${account.email}:`, error);
    }
  }

  public async executePurchases() {
    const results = [];
    
    for (const account of this.confirmedAccounts) {
      try {
        const driver = account.driver!;

        // Click purchase button
        const purchaseButton = await driver.wait(
          until.elementLocated(By.xpath("//button[contains(text(), 'Purchase')]")),
          15000
        );
        await purchaseButton.click();

        // Click confirm button
        const confirmButton = await driver.wait(
          until.elementLocated(By.xpath("//button[contains(text(), 'Confirm')]")),
          15000
        );
        await confirmButton.click();

        results.push({ email: account.email, status: 'success' });
      } catch (error) {
        results.push({ email: account.email, status: 'failed', error: error.message });
      }
    }

    return results;
  }
}