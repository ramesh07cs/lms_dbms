# Library Management System - Backend API

Flask REST API backend for the Library Management System with PostgreSQL database integration.

## Prerequisites

- Python 3.8 or higher
- PostgreSQL (installed and running)
- pgAdmin4 (for database management)

## Setup Instructions

### 1. Database Setup (pgAdmin4)

1. **Open pgAdmin4** and connect to your PostgreSQL server

2. **Create a new database:**
   - Right-click on "Databases" → "Create" → "Database"
   - Name: `library_db`
   - Owner: `postgres` (or your PostgreSQL user)
   - Click "Save"

3. **Note your database credentials:**
   - Host: `localhost` (usually)
   - Port: `5432` (default PostgreSQL port)
   - Database: `library_db`
   - Username: `postgres` (or your PostgreSQL user)
   - Password: Your PostgreSQL password

### 2. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd lms-backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   
   Create a `.env` file in the `lms-backend` directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=library_db
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password_here

   # Flask Configuration
   FLASK_APP=app.py
   FLASK_ENV=development
   SECRET_KEY=your-secret-key-change-in-production

   # CORS Configuration (optional)
   CORS_ORIGINS=http://localhost:5173
   ```
   
   **Important:** Replace `your_postgres_password_here` with your actual PostgreSQL password.

5. **Initialize the database:**
   ```bash
   python init_db.py
   ```
   
   This will:
   - Create all necessary tables
   - Seed initial roles (Student, Teacher, Admin)
   - Create a default admin user (email: `admin@library.com`, password: `admin123`)

### 3. Run the Backend Server

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (requires authentication)

### Admin Dashboard Endpoints

- `GET /api/admin/stats` - Get dashboard statistics (requires admin)
- `GET /api/admin/recent-activities` - Get recent audit log entries (requires admin)
- `GET /api/admin/pending-users` - Get pending user verifications (requires admin)
- `PUT /api/admin/verify-user/<user_id>` - Approve/reject user (requires admin)

## API Documentation

### Register User
```json
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role_id": 1
}
```

### Login
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Verify User (Admin)
```json
PUT /api/admin/verify-user/1
Content-Type: application/json

{
  "action": "approve"  // or "reject"
}
```

## Database Schema

The following tables are created:

- **users** - User accounts
- **roles** - User roles (Student, Teacher, Admin)
- **books** - Library books
- **borrows** - Book borrowing records
- **auditlog** - System audit log

## Default Admin Credentials

After running `init_db.py`:
- Email: `admin@library.com`
- Password: `admin123`

**⚠️ IMPORTANT:** Change the default admin password after first login!

## Troubleshooting

### Database Connection Issues

1. Ensure PostgreSQL is running
2. Verify database credentials in `.env` file
3. Check if database `library_db` exists in pgAdmin4
4. Ensure PostgreSQL user has proper permissions

### Port Already in Use

If port 5000 is already in use, modify `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Change port
```

## Development

- The backend uses Flask session-based authentication
- CORS is enabled for frontend integration
- Database connection pooling is configured
- All passwords are hashed using bcrypt (10 rounds)
- Audit logging is implemented for critical actions
