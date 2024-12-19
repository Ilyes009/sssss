import hashlib
import sys
from keyauth import api
import os
from colorama import Fore

class AuthManager:
    def __init__(self):
        self.keyauthapp = api(
            name="HydraV1",
            ownerid="fV0uvYnrch",
            version="1.0",
            hash_to_check=self._get_checksum()
        )

    def _get_checksum(self):
        md5_hash = hashlib.md5()
        with open(''.join(sys.argv), "rb") as file:
            md5_hash.update(file.read())
        return md5_hash.hexdigest()

    def verify_license(self, key=None):
        try:
            if not key:
                key = os.getenv('ACCESS_KEY')
            
            if not key:
                return False, "No access key provided"
            
            self.keyauthapp.license(key)
            return True, "Login successful"
        except Exception as e:
            return False, str(e)