from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from src.utils.logger import log_message
from colorama import Fore, Style

def prepare_purchase(webpage, sec, sub_purchase, main_purchase, sale_orders_value, confirmed_accounts, owned_accounts):
    try:
        driver = webpage.driver

        count = 5
        while count > 0:
            try:
                iframe = driver.execute_script(
                    'return document.querySelector("#app > div.r6s-marketplace.undefined > div > div > ubisoft-connect").shadowRoot.querySelector("iframe")'
                )
                if iframe:
                    driver.switch_to.frame(iframe)
                    log_message(f"{webpage.email} logged in successfully!", color=Fore.GREEN)
                    break
            except Exception as e:
                count -= 1
                time.sleep(10)
                if count == 0:
                    log_message(f"Failed to switch to iframe for {webpage.email}: {e}", color=Fore.RED)

        if sale_orders_value is None:
            try:
                sale_orders_element = WebDriverWait(driver, sec).until(
                    EC.presence_of_element_located((By.XPATH, "/html/body/div[2]/div/div/div[1]/div[1]/div[2]/div/div/div[2]/div/div[1]/div/div/div[2]/div/div[1]/div[2]/div[3]/div[2]/div[2]/span[2]"))
                )
                sale_orders_value = int(sale_orders_element.text.replace(',', '').strip())
                print(Fore.MAGENTA + f"Current Amount Of Sale Orders: {sale_orders_value}" + Style.RESET_ALL)
            except Exception as e:
                log_message(f"Failed to retrieve sale orders value for {webpage.email}: {e}", color=Fore.RED)

        try:
            price_input = WebDriverWait(driver, sec).until(
                EC.presence_of_element_located((By.XPATH, "//*[@id='marketplace']/div/div[1]/div/div/div[2]/div/div[1]/div[2]/div[2]/div[2]/div[1]/div/div/div/input"))
            )
            price_input.click()
            purchase_value = main_purchase if webpage.status == "main" else sub_purchase
            price_input.send_keys(str(purchase_value))
            if webpage.status == "main":
                print(Fore.BLUE + f"Main account purchase value: {purchase_value}" + Style.RESET_ALL)
            else:
                print(Fore.YELLOW + f"Sub account purchase value: {purchase_value}" + Style.RESET_ALL)
            confirmed_accounts.append(webpage)
        except Exception:
            log_message(f"The account {webpage.email} may already own this item (input field not accessible).", color=Fore.RED)
            owned_accounts.append(webpage)
            return

    except Exception as e:
        log_message(f"{webpage.email} preparation process failed: {e}", color=Fore.RED)
        driver.quit()

def execute_purchase(webpage, sec):
    try:
        driver = webpage.driver
        purchase_button = WebDriverWait(driver, sec).until(
            EC.presence_of_element_located((By.XPATH, "//*[@id='marketplace']/div/div[1]/div/div/div[2]/div/div[1]/div[2]/div[2]/div[2]/div[3]/button"))
        )
        log_message(f"Pressing purchase button for {webpage.email}", color=Fore.GREEN)
        purchase_button.click()

        final_confirm_button = WebDriverWait(driver, sec).until(
            EC.presence_of_element_located((By.XPATH, "//*[@id='shell-modal-id']/div/div[3]/div/div/button[2]"))
        )
        log_message(f"Pressing final confirmation button for {webpage.email}", color=Fore.GREEN)
        final_confirm_button.click()

    except Exception as e:
        log_message(f"{webpage.email} purchase execution failed: {e}", color=Fore.RED)