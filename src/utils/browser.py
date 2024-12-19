from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import os
from src.config import BASE_PROFILE_DIR

def open_browser(account_email):
    profile_dir = os.path.join(BASE_PROFILE_DIR, account_email)
    os.makedirs(profile_dir, exist_ok=True)
    
    chrome_options = Options()
    chrome_options.add_argument(f"--user-data-dir={profile_dir}")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-logging")
    chrome_options.add_argument("--log-level=3")
    chrome_options.add_experimental_option('excludeSwitches', ['enable-logging', 'enable-automation'])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    driver_service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=driver_service, options=chrome_options)
    driver.maximize_window()
    return driver