bind = "0.0.0.0:5000"
workers = 1  # Since we're using Selenium, we should use only 1 worker
worker_class = "sync"
timeout = 120
keepalive = 5
errorlog = "logs/gunicorn-error.log"
accesslog = "logs/gunicorn-access.log"
loglevel = "info"