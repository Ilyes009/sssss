import logging
from datetime import datetime
import os
from colorama import Fore, Style

class Logger:
    def __init__(self):
        self.logger = logging.getLogger('HydraMarketplace')
        self._setup_logger()

    def _setup_logger(self):
        if not self.logger.handlers:
            self.logger.setLevel(logging.INFO)
            os.makedirs('logs', exist_ok=True)
            
            # File handler
            fh = logging.FileHandler(f'logs/hydra_{datetime.now().strftime("%Y%m%d")}.log')
            fh.setLevel(logging.INFO)
            
            # Console handler
            ch = logging.StreamHandler()
            ch.setLevel(logging.INFO)
            
            formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
            fh.setFormatter(formatter)
            ch.setFormatter(formatter)
            
            self.logger.addHandler(fh)
            self.logger.addHandler(ch)

    def info(self, message):
        self._log(message, Fore.BLUE, logging.INFO)

    def success(self, message):
        self._log(message, Fore.GREEN, logging.INFO)

    def warning(self, message):
        self._log(message, Fore.YELLOW, logging.WARNING)

    def error(self, message):
        self._log(message, Fore.RED, logging.ERROR)

    def _log(self, message, color, level):
        formatted = f"{color}{message}{Style.RESET_ALL}"
        self.logger.log(level, formatted)
        print(formatted)