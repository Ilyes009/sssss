import os
from flask import session

class AuthManager:
    def __init__(self):
        self.password_file = '/app/password.txt'

    def verify_password(self, password):
        try:
            if not os.path.exists(self.password_file):
                return False, "Password file not found"
            
            with open(self.password_file, 'r') as file:
                correct_password = file.read().strip()
                
            if password == correct_password:
                session['authenticated'] = True
                return True, "Login successful"
            
            return False, "Invalid password"
        except Exception as e:
            return False, str(e)

    def is_authenticated(self):
        return session.get('authenticated', False)

    def logout(self):
        session.pop('authenticated', None)