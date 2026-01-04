import os
from dotenv import load_dotenv

load_dotenv()

# Simple configuration - just get what you need
DB_URL = os.getenv("DB_URL", "postgresql://user:password@localhost/dbname")
