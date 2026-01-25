from app import create_app
from models import db, Book

def seed_books():
    app = create_app()
    with app.app_context():
        # Example books data
        books_data = [
            {
                "title": "The Great Gatsby",
                "author": "F. Scott Fitzgerald",
                "isbn": "9780743273565",
                "total_copies": 5,
                "available_copies": 5
            },
            {
                "title": "To Kill a Mockingbird",
                "author": "Harper Lee",
                "isbn": "9780446310789",
                "total_copies": 3,
                "available_copies": 3
            },
            {
                "title": "1984",
                "author": "George Orwell",
                "isbn": "9780451524935",
                "total_copies": 4,
                "available_copies": 4
            },
            {
                "title": "Python Crash Course",
                "author": "Eric Matthes",
                "isbn": "9781593279288",
                "total_copies": 10,
                "available_copies": 10
            }
        ]

        print("Seeding books...")
        for data in books_data:
            if not Book.query.filter_by(isbn=data['isbn']).first():
                book = Book(**data)
                db.session.add(book)
                print(f"  + Added: {data['title']}")
            else:
                print(f"  - Skipped (exists): {data['title']}")
        
        db.session.commit()
        print("Done!")

if __name__ == '__main__':
    seed_books()
