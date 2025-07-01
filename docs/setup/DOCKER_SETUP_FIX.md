# 🐳 Docker Setup Fix Documentation

## ✅ Issues Fixed

### 1. **Apache DocumentRoot Missing**
- **Problem**: `AH00112: Warning: DocumentRoot [/var/www/html/public] does not exist`
- **Solution**: Created proper Dockerfile that copies Laravel backend files and creates necessary directories

### 2. **404 Errors on All Routes**
- **Problem**: All routes returning 404 errors
- **Solution**: 
  - Fixed Apache configuration with proper Laravel routing
  - Added catch-all route for SPA
  - Configured mod_rewrite properly

### 3. **Tabler Icons Import Failure**
- **Problem**: `Failed to resolve import "@tabler/icons-vue"`
- **Solution**: Package already installed in package.json, issue was with build process

### 4. **Vite Build Issues**
- **Problem**: Dynamic imports and build failures
- **Solution**: Configured proper Vite setup for Docker environment

## 📁 New Files Created

### 1. **docker/backend-fixed.Dockerfile**
```dockerfile
# Laravel Backend with proper structure
FROM php:8.2-apache
# ... proper Laravel setup with all extensions
```

### 2. **docker/apache-laravel.conf**
```apache
<VirtualHost *:80>
    ServerName localhost
    DocumentRoot /var/www/html/public
    # ... proper Laravel Apache configuration
</VirtualHost>
```

### 3. **docker/entrypoint-laravel.sh**
```bash
#!/bin/bash
# Handles database wait, migrations, permissions
```

### 4. **docker-compose.simple.yml**
```yaml
# Simplified docker-compose for development
version: '3.8'
services:
  backend:
    # Laravel backend with fixed paths
  postgres:
    # PostgreSQL database
  frontend:
    # Vue.js frontend with Vite
```

### 5. **backend/resources/views/spa.blade.php**
```blade
<!DOCTYPE html>
<!-- SPA template for Laravel to serve -->
```

## 🚀 Quick Start

### 1. **Build and Start Containers**
```bash
# Use the simplified docker-compose
docker-compose -f docker-compose.simple.yml up -d --build
```

### 2. **Run Test Script**
```bash
# Execute the test script
./test-docker-setup.sh
```

### 3. **Access Application**
- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- API: http://localhost:8000/api/v1

## 🔧 Configuration Details

### Backend Configuration
- **PHP Version**: 8.2 with Apache
- **Extensions**: pdo_pgsql, gd, zip, bcmath, opcache, mbstring
- **Document Root**: `/var/www/html/public`
- **Storage**: Persistent volume mounted
- **Permissions**: www-data:www-data with 755

### Frontend Configuration
- **Node Version**: 18-alpine
- **Dev Server**: Vite on port 5173
- **API URL**: Configured via environment variable
- **Hot Reload**: Enabled for development

### Database Configuration
- **PostgreSQL**: Version 16-alpine
- **Database**: attendance_system
- **User**: attendance_user
- **Password**: attendance_pass
- **Port**: 5432

## 📝 Common Commands

### Docker Commands
```bash
# Start all services
docker-compose -f docker-compose.simple.yml up -d

# View logs
docker-compose -f docker-compose.simple.yml logs -f

# Stop all services
docker-compose -f docker-compose.simple.yml down

# Rebuild containers
docker-compose -f docker-compose.simple.yml build --no-cache

# Execute commands in container
docker exec -it attendance_backend bash
docker exec -it attendance_postgres psql -U attendance_user -d attendance_system
```

### Laravel Commands
```bash
# Run migrations
docker exec attendance_backend php artisan migrate

# Clear caches
docker exec attendance_backend php artisan cache:clear
docker exec attendance_backend php artisan config:clear
docker exec attendance_backend php artisan view:clear

# Generate key
docker exec attendance_backend php artisan key:generate

# Create storage link
docker exec attendance_backend php artisan storage:link
```

### Frontend Commands
```bash
# Install dependencies
docker exec attendance_frontend npm install

# Build for production
docker exec attendance_frontend npm run build

# Run tests
docker exec attendance_frontend npm test
```

## 🐛 Troubleshooting

### Issue: Backend container fails to start
```bash
# Check logs
docker logs attendance_backend

# Common fixes:
# 1. Ensure .env file exists in backend directory
# 2. Check file permissions
# 3. Verify composer dependencies
```

### Issue: Database connection refused
```bash
# Wait for PostgreSQL to be ready
docker exec attendance_postgres pg_isready

# Check PostgreSQL logs
docker logs attendance_postgres

# Verify credentials in .env match docker-compose
```

### Issue: Frontend build errors
```bash
# Clear node_modules and reinstall
docker exec attendance_frontend rm -rf node_modules
docker exec attendance_frontend npm install

# Check for missing dependencies
docker exec attendance_frontend npm list
```

### Issue: Permission denied errors
```bash
# Fix storage permissions
docker exec attendance_backend chown -R www-data:www-data storage
docker exec attendance_backend chmod -R 775 storage
```

## ✅ Verification Steps

1. **Backend Health Check**
   ```bash
   curl http://localhost:8000/health.php
   # Should return: OK
   ```

2. **API Check**
   ```bash
   curl http://localhost:8000/api/v1
   # Should return: {"message":"API endpoint not found.","status":404}
   ```

3. **Database Check**
   ```bash
   docker exec attendance_postgres pg_isready
   # Should return: accepting connections
   ```

4. **Frontend Check**
   ```bash
   curl http://localhost:5173
   # Should return: Vite dev server HTML
   ```

## 🎯 Next Steps

1. **Run Database Migrations**
   ```bash
   docker exec attendance_backend php artisan migrate
   ```

2. **Seed Database** (if seeders exist)
   ```bash
   docker exec attendance_backend php artisan db:seed
   ```

3. **Build Frontend Assets**
   ```bash
   docker exec attendance_frontend npm run build
   ```

4. **Configure Environment**
   - Update backend/.env with proper values
   - Set VITE_API_URL in frontend environment

5. **Test Authentication**
   - Access http://localhost:5173
   - Try login functionality
   - Verify API communication

## 📊 Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │────▶│    Backend      │────▶│   PostgreSQL    │
│   (Vue + Vite)  │     │  (Laravel API)  │     │   (Database)    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
     Port 5173              Port 8000              Port 5432
```

## 🔒 Security Notes

1. **Change Default Passwords**: Update database passwords in production
2. **Enable HTTPS**: Use proper SSL certificates in production
3. **Firewall Rules**: Configure proper port access
4. **Environment Variables**: Never commit .env files
5. **File Permissions**: Ensure proper ownership and permissions

## 🎉 Success!

Your Docker setup is now properly configured with:
- ✅ Laravel backend serving API and SPA routes
- ✅ PostgreSQL database ready for connections
- ✅ Vue.js frontend with Vite hot reload
- ✅ Proper file structure and permissions
- ✅ Health checks and monitoring
- ✅ Easy-to-use test script

The application should now be accessible and all 404 errors resolved!