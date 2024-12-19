import panel as pn
from src.auth.auth_manager import AuthManager
from src.marketplace.purchase_manager import PurchaseManager
from src.browser.chrome_manager import ChromeManager
from src.utils.logger import Logger
import os

# Initialize components
auth_manager = AuthManager()
chrome_manager = ChromeManager(os.path.join(os.getcwd(), "chrome_profiles"))
purchase_manager = PurchaseManager()
logger = Logger()

def create_marketplace_panel():
    # Create Panel interface components
    item_code = pn.widgets.TextInput(name="Item Code", placeholder="Enter item code...")
    sub_purchase = pn.widgets.IntInput(name="Sub Account Max Purchase", value=0)
    main_purchase = pn.widgets.IntInput(name="Main Account Max Purchase", value=0)
    status = pn.widgets.StaticText(value="")
    
    def process_purchase(event):
        try:
            # Implementation of purchase process using the managers
            logger.info(f"Processing purchase for item {item_code.value}")
            # Add your purchase logic here
            status.value = "Purchase completed successfully"
        except Exception as e:
            logger.error(f"Purchase failed: {str(e)}")
            status.value = f"Error: {str(e)}"
    
    process_button = pn.widgets.Button(name="Start Process", button_type="primary")
    process_button.on_click(process_purchase)
    
    return pn.Column(
        pn.pane.Markdown("# Marketplace Buy Tool"),
        item_code,
        sub_purchase,
        main_purchase,
        process_button,
        status
    )

def main():
    # Create login panel
    key_input = pn.widgets.PasswordInput(name="Authorization Key", placeholder="Enter your key...")
    status = pn.widgets.StaticText(value="")
    
    def handle_login(event):
        success, message = auth_manager.verify_license(key_input.value)
        if success:
            logger.success("Login successful")
            status.value = "Login successful! Redirecting..."
            pn.state.location.reload()
            return create_marketplace_panel()
        else:
            logger.error(f"Login failed: {message}")
            status.value = f"Login failed: {message}"
    
    login_button = pn.widgets.Button(name="Login", button_type="primary")
    login_button.on_click(handle_login)
    
    login_panel = pn.Column(
        pn.pane.Markdown("# Welcome To Hydra HQ"),
        key_input,
        login_button,
        status
    )

    # Configure the server
    pn.config.js_files['custom'] = {
        'urls': ['https://cdn.tailwindcss.com']  # Add TailwindCSS for better styling
    }
    
    # Start the server with specific host and port
    pn.serve({'/': login_panel}, address='144.126.225.177', port=5000, show=False)

if __name__ == "__main__":
    main()