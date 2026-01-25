from app import create_app
from models import db
from sqlalchemy import text

def inspect_table():
    app = create_app()
    with app.app_context():
        try:
            # Query information_schema to get column names for 'users' table
            result = db.session.execute(text(
                "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'"
            ))
            print("Columns in 'users' table:")
            for row in result:
                print(f"- {row[0]} ({row[1]})")
        except Exception as e:
            print(f"Error inspecting table: {e}")

if __name__ == '__main__':
    inspect_table()
