from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from src.utils.logger import Logger
import time

class PurchaseManager:
    def __init__(self):
        self.logger = Logger()
        self.confirmed_accounts = []
        self.owned_accounts = []
        self.sale_orders_value = None

    def prepare_purchase(self, webpage, timeout, sub_purchase, main_purchase):
        try:
            driver = webpage.driver
            if not self._switch_to_iframe(driver):
                return False

            if self.sale_orders_value is None:
                self._get_sale_orders(driver, timeout)

            self._set_purchase_value(driver, webpage, timeout, sub_purchase, main_purchase)
            return True
        except Exception as e:
            self.logger.error(f"Failed to prepare purchase for {webpage.email}: {str(e)}")
            return False

    def execute_purchase(self, webpage, timeout):
        try:
            driver = webpage.driver
            self._click_purchase_button(driver, timeout)
            self._confirm_purchase(driver, timeout)
            return True
        except Exception as e:
            self.logger.error(f"Failed to execute purchase for {webpage.email}: {str(e)}")
            return False

    def _switch_to_iframe(self, driver):
        for _ in range(5):
            try:
                iframe = driver.execute_script(
                    'return document.querySelector("#app > div.r6s-marketplace.undefined > div > div > ubisoft-connect").shadowRoot.querySelector("iframe")'
                )
                if iframe:
                    driver.switch_to.frame(iframe)
                    return True
            except:
                time.sleep(2)
        return False

    def _get_sale_orders(self, driver, timeout):
        try:
            element = WebDriverWait(driver, timeout).until(
                EC.presence_of_element_located((By.XPATH, "//span[contains(@class, 'sale-orders')]"))
            )
            self.sale_orders_value = int(element.text.replace(',', ''))
        except Exception as e:
            self.logger.error(f"Failed to get sale orders: {str(e)}")

    def _set_purchase_value(self, driver, webpage, timeout, sub_purchase, main_purchase):
        try:
            input_field = WebDriverWait(driver, timeout).until(
                EC.presence_of_element_located((By.XPATH, "//input[@type='number']"))
            )
            purchase_value = main_purchase if webpage.status == "main" else sub_purchase
            input_field.clear()
            input_field.send_keys(str(purchase_value))
            self.confirmed_accounts.append(webpage)
        except:
            self.owned_accounts.append(webpage)

    def _click_purchase_button(self, driver, timeout):
        button = WebDriverWait(driver, timeout).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Purchase')]"))
        )
        button.click()

    def _confirm_purchase(self, driver, timeout):
        confirm_button = WebDriverWait(driver, timeout).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Confirm')]"))
        )
        confirm_button.click()