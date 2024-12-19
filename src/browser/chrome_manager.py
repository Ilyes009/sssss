from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import os

class ChromeManager:
    def __init__(self, profile_dir):
        self.profile_dir = profile_dir
        os.makedirs(profile_dir, exist_ok=True)

    def create_browser(self, account_email):
        options = self._get_chrome_options(account_email)
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        return driver

    def _get_chrome_options(self, account_email):
        profile_dir = os.path.join(self.profile_dir, account_email)
        os.makedirs(profile_dir, exist_ok=True)
        
        options = Options()
        options.add_argument(f"--user-data-dir={profile_dir}")
        options.add_argument("--no-sandbox")
        options.add_argument("--headless")  # Run headless on VPS
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_experimental_option('excludeSwitches', ['enable-logging'])
        return options