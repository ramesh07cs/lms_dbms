from flask import Blueprint, request, jsonify, session
from models import db, User, Role, Book, Borrow, AuditLog
from datetime import datetime, timedelta
from routes.auth import admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_stats():
    """Get dashboard statistics"""
    try:
        # Total students
        student_role = Role.query.filter_by(role_name='Student').first()
        total_students = User.query.filter_by(
            role_id=student_role.role_id if student_role else None,
            status='APPROVED'
        ).count() if student_role else 0
        
        # Total books
        total_books = Book.query.count()
        
        # Books borrowed (currently borrowed)
        books_borrowed = Borrow.query.filter_by(status='BORROWED').count()
        
        # Overdue books
        today = datetime.utcnow()
        overdue_books = Borrow.query.filter(
            Borrow.status == 'BORROWED',
            Borrow.due_date < today
        ).count()
        
        # Pending verifications
        pending_verifications = User.query.filter_by(status='PENDING').count()
        
        return jsonify({
            'total_students': total_students,
            'total_books': total_books,
            'books_borrowed': books_borrowed,
            'overdue_books': overdue_books,
            'pending_verifications': pending_verifications
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e), 'status': 500}), 500

@admin_bp.route('/recent-activities', methods=['GET'])
@admin_required
def get_recent_activities():
    """Get latest 5 audit log entries"""
    try:
        activities = AuditLog.query.order_by(
            AuditLog.timestamp.desc()
        ).limit(5).all()
        
        result = []
        for activity in activities:
            result.append({
                'user_name': activity.user.name if activity.user else 'System',
                'action': activity.action,
                'table_name': activity.table_name,
                'timestamp': activity.timestamp.isoformat() if activity.timestamp else None
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e), 'status': 500}), 500

@admin_bp.route('/pending-users', methods=['GET'])
@admin_required
def get_pending_users():
    """Get users with PENDING status"""
    try:
        pending_users = User.query.filter_by(status='PENDING').order_by(
            User.created_at.desc()
        ).all()
        
        result = []
        for user in pending_users:
            result.append({
                'user_id': user.user_id,
                'name': user.name,
                'email': user.email,
                'phone': user.phone,
                'role_name': user.role.role_name if user.role else None,
                'created_at': user.created_at.isoformat() if user.created_at else None
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e), 'status': 500}), 500

@admin_bp.route('/verify-user/<int:user_id>', methods=['PUT'])
@admin_required
def verify_user(user_id):
    """Approve or reject a user"""
    try:
        data = request.get_json()
        
        if not data or 'action' not in data:
            return jsonify({'error': 'action field is required (approve or reject)', 'status': 400}), 400
        
        action = data['action'].lower()
        if action not in ['approve', 'reject']:
            return jsonify({'error': 'action must be "approve" or "reject"', 'status': 400}), 400
        
        # Find user
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found', 'status': 404}), 404
        
        if user.status != 'PENDING':
            return jsonify({'error': f'User status is already {user.status}', 'status': 400}), 400
        
        # Update user status
        admin_user_id = session.get('user_id')
        user.status = 'APPROVED' if action == 'approve' else 'REJECTED'
        user.approved_by = admin_user_id
        user.approved_at = datetime.utcnow()
        
        db.session.commit()
        
        # Log action
        audit_log = AuditLog(
            user_id=admin_user_id,
            action=action.upper(),
            table_name='users',
            record_id=user_id
        )
        db.session.add(audit_log)
        db.session.commit()
        
        action_message = 'approved' if action == 'approve' else 'rejected'
        return jsonify({
            'message': f'User {action_message} successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e), 'status': 500}), 500
