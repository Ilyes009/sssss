import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Security settings
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# Database settings
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///db.sqlite3')

# Chrome profiles directory
CHROME_PROFILES_DIR = os.path.join(BASE_DIR, "chrome_profiles")

# KeyAuth settings
KEYAUTH_CONFIG = {
    "name": "HydraV1",
    "ownerid": "fV0uvYnrch",
    "version": "1.0"
}

# Session settings
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True