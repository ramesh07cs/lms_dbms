from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import bcrypt

db = SQLAlchemy()

class User(db.Model):
    """User model"""
    __tablename__ = 'users'
    
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20))
    role_id = db.Column(db.Integer, db.ForeignKey('roles.role_id'), nullable=False)
    status = db.Column(db.String(20), default='PENDING', nullable=False)  # PENDING, APPROVED, REJECTED
    approved_by = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=True)
    approved_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    role = db.relationship('Role', backref='users')
    approver = db.relationship('User', remote_side=[user_id], foreign_keys=[approved_by])
    
    def set_password(self, password):
        """Hash and set password using bcrypt"""
        salt = bcrypt.gensalt(rounds=10)
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def check_password(self, password):
        """Verify password using bcrypt"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'user_id': self.user_id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'role_name': self.role.role_name if self.role else None,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'approved_at': self.approved_at.isoformat() if self.approved_at else None
        }

class Role(db.Model):
    """Role model"""
    __tablename__ = 'roles'
    
    role_id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(50), unique=True, nullable=False)  # Student, Teacher, Admin
    
    def __repr__(self):
        return f'<Role {self.role_name}>'

class Book(db.Model):
    """Book model"""
    __tablename__ = 'books'
    
    book_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    isbn = db.Column(db.String(20), unique=True)
    total_copies = db.Column(db.Integer, default=1, nullable=False)
    available_copies = db.Column(db.Integer, default=1, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        """Convert book to dictionary"""
        return {
            'book_id': self.book_id,
            'title': self.title,
            'author': self.author,
            'isbn': self.isbn,
            'total_copies': self.total_copies,
            'available_copies': self.available_copies
        }

class Borrow(db.Model):
    """Borrow model"""
    __tablename__ = 'borrows'
    
    borrow_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.book_id'), nullable=False)
    borrow_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    return_date = db.Column(db.DateTime, nullable=True)
    due_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='BORROWED', nullable=False)  # BORROWED, RETURNED, OVERDUE
    
    # Relationships
    user = db.relationship('User', backref='borrows')
    book = db.relationship('Book', backref='borrows')
    
    def to_dict(self):
        """Convert borrow to dictionary"""
        return {
            'borrow_id': self.borrow_id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'borrow_date': self.borrow_date.isoformat() if self.borrow_date else None,
            'return_date': self.return_date.isoformat() if self.return_date else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'status': self.status
        }

class AuditLog(db.Model):
    """Audit log model"""
    __tablename__ = 'auditlog'
    
    log_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=True)
    action = db.Column(db.String(50), nullable=False)  # CREATE, UPDATE, DELETE, APPROVE, REJECT
    table_name = db.Column(db.String(50), nullable=False)
    record_id = db.Column(db.Integer, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = db.relationship('User', backref='audit_logs')
    
    def to_dict(self):
        """Convert audit log to dictionary"""
        return {
            'log_id': self.log_id,
            'user_id': self.user_id,
            'user_name': self.user.name if self.user else None,
            'action': self.action,
            'table_name': self.table_name,
            'record_id': self.record_id,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }
