from flask import Blueprint, request, jsonify, session
from models import db, User, Role, AuditLog
from datetime import datetime
from functools import wraps

auth_bp = Blueprint('auth', __name__)

def login_required(f):
    """Decorator to require login"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required', 'status': 401}), 401
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required', 'status': 401}), 401
        
        user = User.query.get(session['user_id'])
        if not user or not user.role or user.role.role_name != 'Admin':
            return jsonify({'error': 'Admin access required', 'status': 403}), 403
        
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'password', 'phone', 'role_id']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required', 'status': 400}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered', 'status': 400}), 400
        
        # Validate role_id exists
        role = Role.query.get(data['role_id'])
        if not role:
            return jsonify({'error': 'Invalid role_id', 'status': 400}), 400
        
        # Create new user
        user = User(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            role_id=data['role_id'],
            status='PENDING'
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Log registration
        audit_log = AuditLog(
            user_id=user.user_id,
            action='CREATE',
            table_name='users',
            record_id=user.user_id
        )
        db.session.add(audit_log)
        db.session.commit()
        
        return jsonify({
            'message': 'Registration successful. Please wait for admin approval.',
            'user_id': user.user_id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e), 'status': 500}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password are required', 'status': 400}), 400
        
        # Find user by email
        user = User.query.filter_by(email=data['email']).first()
        
        if not user:
            return jsonify({'error': 'Invalid email or password', 'status': 401}), 401
        
        # Verify password
        if not user.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password', 'status': 401}), 401
        
        # Check if user is approved
        if user.status != 'APPROVED':
            return jsonify({
                'error': f'Account status: {user.status}. Please wait for admin approval.',
                'status': 403
            }), 403
        
        # Set session
        session['user_id'] = user.user_id
        session['role'] = user.role.role_name if user.role else None
        
        # Log login
        audit_log = AuditLog(
            user_id=user.user_id,
            action='LOGIN',
            table_name='users',
            record_id=user.user_id
        )
        db.session.add(audit_log)
        db.session.commit()
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'user_id': user.user_id,
                'name': user.name,
                'email': user.email,
                'role_name': user.role.role_name if user.role else None,
                'status': user.status
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e), 'status': 500}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user"""
    try:
        user_id = session.get('user_id')
        
        if user_id:
            # Log logout
            audit_log = AuditLog(
                user_id=user_id,
                action='LOGOUT',
                table_name='users',
                record_id=user_id
            )
            db.session.add(audit_log)
            db.session.commit()
        
        session.clear()
        return jsonify({'message': 'Logout successful'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e), 'status': 500}), 500

@auth_bp.route('/me', methods=['GET'])
@login_required
def get_current_user():
    """Get current logged-in user"""
    try:
        user = User.query.get(session['user_id'])
        if not user:
            return jsonify({'error': 'User not found', 'status': 404}), 404
        
        return jsonify({'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e), 'status': 500}), 500
