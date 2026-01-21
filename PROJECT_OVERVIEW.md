# Library Management System - Complete Project Overview

This project consists of a full-stack Library Management System with a React frontend and Flask backend.

## Project Structure

```
LMS_DBMS/
├── lms-frontend/          # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── AdminDashboardPage.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── lms-backend/           # Flask REST API backend
│   ├── routes/
│   │   ├── auth.py       # Authentication endpoints
│   │   └── admin.py      # Admin dashboard endpoints
│   ├── models.py         # Database models
│   ├── config.py         # Configuration
│   ├── app.py            # Flask application
│   ├── init_db.py        # Database initialization
│   └── requirements.txt
│
└── promt.txt             # Project requirements
```

## Quick Start Guide

### 1. Database Setup (pgAdmin4)

1. Open pgAdmin4
2. Create database named `library_db`
3. Note your PostgreSQL credentials

See `lms-backend/DATABASE_SETUP.md` for detailed instructions.

### 2. Backend Setup

```bash
cd lms-backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Create .env file with your database credentials
# (See lms-backend/README.md for template)

# Initialize database
python init_db.py

# Start backend server
python app.py
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd lms-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Admin Dashboard

- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/recent-activities` - Recent audit logs
- `GET /api/admin/pending-users` - Pending user verifications
- `PUT /api/admin/verify-user/<user_id>` - Approve/reject user

## Default Admin Credentials

After running `init_db.py`:
- Email: `admin@library.com`
- Password: `admin123`

**⚠️ Change this password after first login!**

## Features Implemented

### Frontend
- ✅ Registration page with validation
- ✅ Login page with error handling
- ✅ Admin dashboard with statistics
- ✅ Modern UI with Tailwind CSS
- ✅ Responsive design
- ✅ Toast notifications

### Backend
- ✅ Flask REST API
- ✅ PostgreSQL database integration
- ✅ Session-based authentication
- ✅ bcrypt password hashing (10 rounds)
- ✅ Admin role-based access control
- ✅ Audit logging
- ✅ CORS enabled for frontend
- ✅ Database connection pooling
- ✅ Input validation
- ✅ Error handling with proper HTTP status codes

## Database Schema

- **users** - User accounts with status (PENDING/APPROVED/REJECTED)
- **roles** - User roles (Student, Teacher, Admin)
- **books** - Library books
- **borrows** - Book borrowing records
- **auditlog** - System audit log for tracking actions

## Next Steps

1. Set up PostgreSQL database in pgAdmin4
2. Configure backend `.env` file
3. Initialize database with `init_db.py`
4. Start backend server
5. Start frontend server
6. Test the application

## Documentation

- Backend API: `lms-backend/README.md`
- Database Setup: `lms-backend/DATABASE_SETUP.md`
- Frontend: `lms-frontend/README.md` (Vite default)
