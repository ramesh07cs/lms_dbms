from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from routes.auth import auth_bp
from routes.admin import admin_bp

def create_app():
    """Application factory"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, origins=app.config['CORS_ORIGINS'], supports_credentials=True)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    # Create tables
    with app.app_context():
        db.create_all()
        
        # Auto-seed roles and admin if they don't exist
        from models import Role, User
        
        # Seed Roles
        roles = ['Student', 'Teacher', 'Admin']
        for role_name in roles:
            if not Role.query.filter_by(role_name=role_name).first():
                db.session.add(Role(role_name=role_name))
        db.session.commit()
        
        # Seed Admin
        admin_role = Role.query.filter_by(role_name='Admin').first()
        if admin_role:
            admin_email = 'admin@library.com'
            if not User.query.filter_by(email=admin_email).first():
                admin_user = User(
                    name='System Admin',
                    email=admin_email,
                    phone='0000000000',
                    role_id=admin_role.role_id,
                    status='APPROVED'
                )
                admin_user.set_password('admin123')
                db.session.add(admin_user)
                db.session.commit()
                print(f"Admin created: {admin_email} / admin123")
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
