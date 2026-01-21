"""
Database initialization script
Run this script to create tables and seed initial data
"""
from app import create_app
from models import db, Role

def init_database():
    """Initialize database with tables and seed data"""
    app = create_app()
    
    with app.app_context():
        # Create all tables
        print("Creating database tables...")
        db.create_all()
        print("✓ Tables created successfully")
        
        # Seed roles if they don't exist
        print("\nSeeding roles...")
        roles = ['Student', 'Teacher', 'Admin']
        for role_name in roles:
            role = Role.query.filter_by(role_name=role_name).first()
            if not role:
                role = Role(role_name=role_name)
                db.session.add(role)
                print(f"  ✓ Added role: {role_name}")
            else:
                print(f"  - Role already exists: {role_name}")
        
        db.session.commit()
        print("\n✓ Database initialization complete!")
        
        # Create a default admin user (optional)
        print("\nCreating default admin user...")
        from models import User
        
        admin_role = Role.query.filter_by(role_name='Admin').first()
        if admin_role:
            admin_email = 'admin@library.com'
            admin_user = User.query.filter_by(email=admin_email).first()
            
            if not admin_user:
                admin_user = User(
                    name='System Admin',
                    email=admin_email,
                    phone='0000000000',
                    role_id=admin_role.role_id,
                    status='APPROVED'
                )
                admin_user.set_password('admin123')  # Change this in production!
                db.session.add(admin_user)
                db.session.commit()
                print(f"  ✓ Default admin created:")
                print(f"    Email: {admin_email}")
                print(f"    Password: admin123")
                print(f"    ⚠️  Please change the password after first login!")
            else:
                print(f"  - Admin user already exists")

if __name__ == '__main__':
    init_database()
