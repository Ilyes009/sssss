class Webpage:
    def __init__(self, driver, email, status):
        self.driver = driver
        self.email = email
        self.status = status
        self.main_window = None

    def set_mainwindow(self, handle):
        self.main_window = handle

    def get_mainwindow(self):
        return self.main_window