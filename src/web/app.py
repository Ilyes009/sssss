from flask import Flask, request, jsonify, session, redirect
from src.auth.auth_manager import AuthManager
from functools import wraps
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)
auth_manager = AuthManager()

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not auth_manager.is_authenticated():
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    password = data.get('password')
    
    success, message = auth_manager.verify_password(password)
    return jsonify({'success': success, 'message': message})

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    auth_manager.logout()
    return jsonify({'success': True})

@app.route('/api/auth/check', methods=['GET'])
def check_auth():
    return jsonify({'authenticated': auth_manager.is_authenticated()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)