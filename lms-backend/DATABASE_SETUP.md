# Database Setup Guide for pgAdmin4

This guide will help you set up the PostgreSQL database using pgAdmin4 for the Library Management System.

## Step 1: Install PostgreSQL and pgAdmin4

If you haven't already:
1. Download PostgreSQL from: https://www.postgresql.org/download/
2. During installation, pgAdmin4 will be installed automatically
3. Remember the password you set for the `postgres` user

## Step 2: Open pgAdmin4

1. Launch pgAdmin4 from your applications
2. Enter the master password you set during installation
3. You should see your PostgreSQL server in the left sidebar

## Step 3: Create the Database

1. **Expand your PostgreSQL server** (usually named "PostgreSQL 16" or similar)
2. **Right-click on "Databases"** → Select **"Create"** → **"Database..."**
3. In the **"General"** tab:
   - **Database name:** `library_db`
   - **Owner:** Select `postgres` (or your PostgreSQL username)
4. Click **"Save"**

## Step 4: Verify Database Connection

1. Expand **"Databases"** → **"library_db"**
2. If you can see the database, it was created successfully
3. Note the following information (you'll need it for the `.env` file):
   - **Host:** `localhost` (usually)
   - **Port:** `5432` (default PostgreSQL port)
   - **Database:** `library_db`
   - **Username:** `postgres` (or your PostgreSQL username)
   - **Password:** The password you set during PostgreSQL installation

## Step 5: Configure Backend Environment

1. Navigate to `lms-backend` directory
2. Create a `.env` file with the following content:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=library_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-change-in-production
CORS_ORIGINS=http://localhost:5173
```

**Replace `your_postgres_password_here` with your actual PostgreSQL password.**

## Step 6: Initialize Database Tables

After setting up the `.env` file, run:

```bash
cd lms-backend
python init_db.py
```

This will:
- Create all necessary tables (users, roles, books, borrows, auditlog)
- Insert default roles (Student, Teacher, Admin)
- Create a default admin user

## Step 7: Verify Tables in pgAdmin4

1. In pgAdmin4, expand **"library_db"** → **"Schemas"** → **"public"** → **"Tables"**
2. You should see the following tables:
   - `users`
   - `roles`
   - `books`
   - `borrows`
   - `auditlog`

## Troubleshooting

### Can't connect to PostgreSQL server

- Ensure PostgreSQL service is running
- Check if the server is listening on port 5432
- Verify your PostgreSQL installation

### Permission denied errors

- Ensure your PostgreSQL user has CREATE DATABASE privileges
- Try using the `postgres` superuser account

### Database already exists

- If `library_db` already exists, you can either:
  - Drop it and recreate (Right-click → Delete/Drop)
  - Or use the existing database (just ensure it's empty or you're okay with existing data)

## Next Steps

After database setup:
1. Start the Flask backend: `python app.py`
2. The API will be available at `http://localhost:5000`
3. Test the connection by registering a new user or logging in
