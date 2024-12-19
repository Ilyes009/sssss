import panel as pn
import pandas as pd
from src.utils.browser import open_browser
from src.utils.token_manager import save_tokens, load_tokens
from src.marketplace.purchase_manager import PurchaseManager
from src.models.webpage import Webpage
from src.utils.logger import logger
from src.config import BASE_PROFILE_DIR
import os

class MarketplacePanel:
    def __init__(self):
        self.item_code = pn.widgets.TextInput(name="Item Code", placeholder="Enter item code...")
        self.sub_purchase = pn.widgets.IntInput(name="Sub Account Max Purchase", value=0)
        self.main_purchase = pn.widgets.IntInput(name="Main Account Max Purchase", value=0)
        self.status_text = pn.widgets.StaticText(value="")
        self.proceed_button = pn.widgets.Button(name="Start Process", button_type="primary")
        self.proceed_button.on_click(self.run_marketplace_tool)
        
        self.purchase_manager = PurchaseManager()
        
        self.layout = pn.Column(
            pn.pane.Markdown("# Marketplace Buy Tool"),
            self.item_code,
            self.sub_purchase,
            self.main_purchase,
            self.proceed_button,
            self.status_text
        )

    def update_status(self, text):
        self.status_text.value = text

    def run_marketplace_tool(self, event):
        url = f"https://www.ubisoft.com/en-gb/game/rainbow-six/siege/marketplace?route=buy/item-details&itemId={self.item_code.value}"
        sec = 15

        sub_webpages = []
        main_webpages = []

        try:
            data = pd.read_excel('Opt1.xlsx')
            
            for index, row in data.iterrows():
                email = row['email']
                status = row['account status'].lower()
                
                driver = open_browser(email)
                webpage = Webpage(driver, email, status)

                token_file = os.path.join(BASE_PROFILE_DIR, f"{email}_tokens.json")
                if os.path.exists(token_file):
                    load_tokens(driver, email)
                    driver.get(url)
                else:
                    self.update_status(f"Please log in manually for {email}")
                    driver.get(url)
                    response = pn.widgets.TextInput(name=f"Login status for {email}", placeholder="Press Enter or type 'N' to skip").value
                    if response.lower() == 'n':
                        logger.warning(f"Skipping token saving for {email}.")
                        continue
                    save_tokens(driver, email)
                
                if status == "sub":
                    sub_webpages.append(webpage)
                elif status == "main":
                    main_webpages.append(webpage)

            for webpage in sub_webpages + main_webpages:
                self.purchase_manager.prepare_purchase(webpage, sec, self.sub_purchase.value, self.main_purchase.value)

            self._show_summary()

        except Exception as e:
            self.update_status(f"Error: {str(e)}")

    def _show_summary(self):
        summary = f"""
        Current Amount Of Sale Orders: {self.purchase_manager.sale_orders_value}
        Transfer Status: {"Possible" if self.purchase_manager.sale_orders_value <= len(self.purchase_manager.confirmed_accounts) else "Not Enough Accounts"}
        
        Accounts that may already own the item: {len(self.purchase_manager.owned_accounts)}
        {[acc.email for acc in self.purchase_manager.owned_accounts]}
        
        Accounts ready for purchase: {len(self.purchase_manager.confirmed_accounts)}
        {[acc.email for acc in self.purchase_manager.confirmed_accounts]}
        """
        
        self.update_status(summary)
        
        proceed = pn.widgets.Button(name="Proceed with Purchase", button_type="success")
        proceed.on_click(lambda event: self._execute_purchases())
        self.layout.append(proceed)

    def _execute_purchases(self):
        for webpage in self.purchase_manager.confirmed_accounts:
            self.purchase_manager.execute_purchase(webpage, 15)
        self.update_status("Purchase process completed!")

    def show(self):
        return self.layout