import os
from dotenv import load_dotenv

load_dotenv()


if os.environ.get("FLASK_ENV") == "production":
    DATABASE_URI = os.environ.get("DATABASE_URL")
    debug = False
else:
    DATABASE_URI = os.environ.get("DATABASE_URL_DEV")
    debug = True
