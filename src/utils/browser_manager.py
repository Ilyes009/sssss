from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import os

class BrowserManager:
    def __init__(self, profiles_dir):
        self.profiles_dir = profiles_dir
        self._setup_profiles_dir()

    def _setup_profiles_dir(self):
        os.makedirs(self.profiles_dir, exist_ok=True)

    def create_browser(self, account_email):
        profile_dir = os.path.join(self.profiles_dir, account_email)
        os.makedirs(profile_dir, exist_ok=True)
        
        options = self._get_chrome_options(profile_dir)
        service = Service(ChromeDriverManager().install())
        
        driver = webdriver.Chrome(service=service, options=options)
        driver.maximize_window()
        return driver

    def _get_chrome_options(self, profile_dir):
        options = Options()
        options.add_argument(f"--user-data-dir={profile_dir}")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-logging")
        options.add_argument("--log-level=3")
        options.add_experimental_option('excludeSwitches', ['enable-logging', 'enable-automation'])
        options.add_experimental_option('useAutomationExtension', False)
        return options