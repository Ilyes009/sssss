from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from src.config.settings import *
from src.auth.auth_manager import AuthManager, login_required
from src.marketplace.market_manager import MarketManager
from src.utils.system import clear_screen
import os

app = Flask(__name__)
app.secret_key = SECRET_KEY
app.config['SESSION_TYPE'] = 'filesystem'

auth_manager = AuthManager(KEYAUTH_CONFIG)
market_manager = MarketManager(CHROME_PROFILES_DIR)

@app.route('/')
def index():
    if 'authenticated' in session:
        return redirect(url_for('dashboard'))
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    key = request.form.get('key')
    success, error = auth_manager.validate_key(key)
    
    if success:
        session['authenticated'] = True
        clear_screen()  # Clear console for better UX in development
        return jsonify({'success': True, 'redirect': url_for('dashboard')})
    return jsonify({'success': False, 'error': error})

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/process', methods=['POST'])
@login_required
def process_marketplace():
    data = request.json
    item_code = data.get('item_code')
    sub_purchase = int(data.get('sub_purchase', 0))
    main_purchase = int(data.get('main_purchase', 0))
    
    results = market_manager.process_accounts(item_code, sub_purchase, main_purchase)
    return jsonify(results)

@app.route('/api/execute', methods=['POST'])
@login_required
def execute_purchases():
    results = market_manager.execute_purchases()
    return jsonify(results)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=DEBUG)