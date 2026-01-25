import os
import psycopg2
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

def reset_database():
    print("Resetting database...")
    
    # Get database URL from environment or config
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        # Construct assuming standard config if url not explicit
        host = os.getenv('DB_HOST', 'localhost')
        port = os.getenv('DB_PORT', '5432')
        name = os.getenv('DB_NAME', 'library_db')
        user = os.getenv('DB_USER', 'postgres')
        password = os.getenv('DB_PASSWORD', '')
        db_url = f"postgresql://{user}:{password}@{host}:{port}/{name}"

    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cur = conn.cursor()
        
        # Determine tables to drop
        # Order matters due to foreign keys: borrows -> auditlog -> users -> roles -> books (logic varies, safer to cascade)
        print("Dropping all tables...")
        cur.execute("DROP SCHEMA public CASCADE;")
        cur.execute("CREATE SCHEMA public;")
        
        print("✓ Schema reset successfully.")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"Error resetting database: {e}")

if __name__ == '__main__':
    reset_database()
