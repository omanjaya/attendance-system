-- PostgreSQL initialization script
-- This script runs when the PostgreSQL container starts for the first time

-- Create additional databases if needed
-- CREATE DATABASE attendance_system_test;

-- Create extensions that might be useful
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE attendance_system TO attendance_user;

-- Switch to the attendance_system database
\c attendance_system;

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO attendance_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO attendance_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO attendance_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO attendance_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO attendance_user;