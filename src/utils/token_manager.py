import json
import os
from src.utils.logger import logger
from colorama import Fore

class TokenManager:
    def __init__(self, base_profile_dir):
        self.base_profile_dir = base_profile_dir

    def save_tokens(self, driver, account_email, saved_accounts=None):
        tokens = {
            "localStorage": driver.execute_script("return Object.entries(localStorage);"),
            "sessionStorage": driver.execute_script("return Object.entries(sessionStorage);"),
            "cookies": driver.get_cookies()
        }

        token_file = os.path.join(self.base_profile_dir, f"{account_email}_tokens.json")
        with open(token_file, "w") as file:
            json.dump(tokens, file)
        
        logger.success(f"Tokens and cookies saved for {account_email}")
        if saved_accounts is not None:
            saved_accounts.append(account_email)

    def load_tokens(self, driver, account_email):
        token_file = os.path.join(self.base_profile_dir, f"{account_email}_tokens.json")
        if os.path.exists(token_file):
            with open(token_file, "r") as file:
                tokens = json.load(file)

            for key, value in tokens["localStorage"]:
                driver.execute_script(f"localStorage.setItem('{key}', '{value}');")

            for key, value in tokens["sessionStorage"]:
                driver.execute_script(f"sessionStorage.setItem('{key}', '{value}');")

            for cookie in tokens["cookies"]:
                driver.add_cookie(cookie)

            logger.success(f"Tokens loaded for {account_email}. Attempting login...")
            return True
        return False

    def has_tokens(self, account_email):
        token_file = os.path.join(self.base_profile_dir, f"{account_email}_tokens.json")
        return os.path.exists(token_file)

# Create compatibility functions for existing code
def save_tokens(driver, account_email, saved_accounts=None):
    token_manager = TokenManager(os.path.join(os.getcwd(), "chrome_profiles"))
    token_manager.save_tokens(driver, account_email, saved_accounts)

def load_tokens(driver, account_email):
    token_manager = TokenManager(os.path.join(os.getcwd(), "chrome_profiles"))
    return token_manager.load_tokens(driver, account_email)