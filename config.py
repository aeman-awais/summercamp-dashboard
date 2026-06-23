import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'mediatiz-camp-secret-key-1337')
    
    # MySQL Database configuration
    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
    MYSQL_PORT = int(os.environ.get('MYSQL_PORT', 3306))
    MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '')
    MYSQL_DB = os.environ.get('MYSQL_DB', 'mediatiz_camp')
    
    # SQLite fallback (optional but recommended for zero-config run)
    SQLITE_DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'camp.db')
    
    # App-specific configs
    DEFAULT_CAMP_CODE = os.environ.get('CAMP_CODE', 'CAMP2026')
