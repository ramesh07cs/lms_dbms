"""
Quick script to test database connection
Run this to verify your database configuration is correct
"""
import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

def test_connection():
    """Test PostgreSQL connection"""
    try:
        # Get database credentials
        db_host = os.getenv('DB_HOST', 'localhost')
        db_port = os.getenv('DB_PORT', '5432')
        db_name = os.getenv('DB_NAME', 'library_db')
        db_user = os.getenv('DB_USER', 'postgres')
        db_password = os.getenv('DB_PASSWORD', '')
        
        print("Testing database connection...")
        print(f"Host: {db_host}")
        print(f"Port: {db_port}")
        print(f"Database: {db_name}")
        print(f"User: {db_user}")
        print()
        
        # Attempt connection
        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            database=db_name,
            user=db_user,
            password=db_password
        )
        
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        
        print("✓ Database connection successful!")
        print(f"PostgreSQL version: {version[0]}")
        
        # Check if tables exist
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """)
        tables = cursor.fetchall()
        
        if tables:
            print(f"\n✓ Found {len(tables)} table(s):")
            for table in tables:
                print(f"  - {table[0]}")
        else:
            print("\n⚠ No tables found. Run 'python init_db.py' to create tables.")
        
        cursor.close()
        conn.close()
        
        return True
        
    except psycopg2.OperationalError as e:
        print(f"✗ Connection failed: {e}")
        print("\nTroubleshooting:")
        print("1. Ensure PostgreSQL is running")
        print("2. Check your .env file has correct credentials")
        print("3. Verify database 'library_db' exists in pgAdmin4")
        return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

if __name__ == '__main__':
    test_connection()
