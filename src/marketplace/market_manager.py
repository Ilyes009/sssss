import pandas as pd
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from src.utils.browser_manager import BrowserManager
from src.utils.token_manager import TokenManager
from src.models.webpage import Webpage
from src.utils.logger import Logger
import time

class MarketManager:
    def __init__(self, chrome_profiles_dir):
        self.chrome_profiles_dir = chrome_profiles_dir
        self.browser_manager = BrowserManager(chrome_profiles_dir)
        self.token_manager = TokenManager(chrome_profiles_dir)
        self.logger = Logger()
        
        self.confirmed_accounts = []
        self.owned_accounts = []
        self.sale_orders_value = None

    def process_accounts(self, item_code, sub_purchase, main_purchase):
        url = f"https://www.ubisoft.com/en-gb/game/rainbow-six/siege/marketplace?route=buy/item-details&itemId={item_code}"
        
        try:
            data = pd.read_excel('Opt1.xlsx')
            
            for _, row in data.iterrows():
                email = row['email']
                status = row['account status'].lower()
                password = row.get('Upassword', '')
                
                webpage = self._process_single_account(email, status, password, url)
                if webpage:
                    if status == "sub":
                        self._prepare_purchase(webpage, sub_purchase)
                    else:
                        self._prepare_purchase(webpage, main_purchase)

            return {
                'success': True,
                'confirmed_accounts': [acc.email for acc in self.confirmed_accounts],
                'owned_accounts': [acc.email for acc in self.owned_accounts],
                'sale_orders': self.sale_orders_value
            }
            
        except Exception as e:
            self.logger.error(f"Error processing accounts: {str(e)}")
            return {
                'success': False,
                'message': str(e),
                'confirmed_accounts': [],
                'owned_accounts': [],
                'sale_orders': None
            }

    def _process_single_account(self, email, status, password, url):
        try:
            driver = self.browser_manager.create_browser(email)
            webpage = Webpage(driver, email, status)
            
            if self.token_manager.has_tokens(email):
                self.token_manager.load_tokens(driver, email)
                driver.get(url)
                return webpage
            else:
                self.logger.warning(f"No tokens found for {email}, skipping")
                return None
                
        except Exception as e:
            self.logger.error(f"Error processing account {email}: {str(e)}")
            return None

    def _prepare_purchase(self, webpage, purchase_value):
        try:
            driver = webpage.driver
            
            # Wait for iframe and switch to it
            iframe = WebDriverWait(driver, 15).until(
                lambda d: d.execute_script(
                    'return document.querySelector("#app > div.r6s-marketplace.undefined > div > div > ubisoft-connect").shadowRoot.querySelector("iframe")'
                )
            )
            driver.switch_to.frame(iframe)

            # Get sale orders value if not already set
            if self.sale_orders_value is None:
                sale_orders_element = WebDriverWait(driver, 15).until(
                    EC.presence_of_element_located((By.XPATH, "//span[contains(@class, 'sale-orders')]"))
                )
                self.sale_orders_value = int(sale_orders_element.text.replace(',', ''))

            # Set purchase value
            try:
                price_input = WebDriverWait(driver, 15).until(
                    EC.presence_of_element_located((By.XPATH, "//input[@type='number']"))
                )
                price_input.clear()
                price_input.send_keys(str(purchase_value))
                self.confirmed_accounts.append(webpage)
            except:
                self.owned_accounts.append(webpage)
                
        except Exception as e:
            self.logger.error(f"Error preparing purchase for {webpage.email}: {str(e)}")

    def execute_purchases(self):
        results = []
        for webpage in self.confirmed_accounts:
            try:
                driver = webpage.driver
                
                # Click purchase button
                purchase_button = WebDriverWait(driver, 15).until(
                    EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Purchase')]"))
                )
                purchase_button.click()

                # Click confirm button
                confirm_button = WebDriverWait(driver, 15).until(
                    EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Confirm')]"))
                )
                confirm_button.click()
                
                results.append({'email': webpage.email, 'status': 'success'})
            except Exception as e:
                results.append({'email': webpage.email, 'status': 'failed', 'error': str(e)})
        
        return results