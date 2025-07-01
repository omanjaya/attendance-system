#!/bin/bash
set -e

echo "🚀 Starting Laravel development environment..."

# Ensure .env exists
if [ ! -f /var/www/html/.env ]; then
    echo "Creating .env file for development..."
    cp /var/www/html/.env.example /var/www/html/.env
    php artisan key:generate
fi

# Set development environment
sed -i 's/APP_ENV=.*/APP_ENV=local/' /var/www/html/.env
sed -i 's/APP_DEBUG=.*/APP_DEBUG=true/' /var/www/html/.env
sed -i 's/DB_CONNECTION=.*/DB_CONNECTION=pgsql/' /var/www/html/.env
sed -i 's/DB_HOST=.*/DB_HOST=postgres/' /var/www/html/.env
sed -i 's/DB_PORT=.*/DB_PORT=5432/' /var/www/html/.env
sed -i 's/DB_DATABASE=.*/DB_DATABASE=attendance_system/' /var/www/html/.env
sed -i 's/DB_USERNAME=.*/DB_USERNAME=attendance_user/' /var/www/html/.env
sed -i 's/DB_PASSWORD=.*/DB_PASSWORD=attendance_pass/' /var/www/html/.env

# Create directories with proper permissions
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/storage/framework/cache
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/bootstrap/cache

# Set proper permissions
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until PGPASSWORD=attendance_pass psql -h postgres -U attendance_user -d attendance_system -c '\q'; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done
echo "✅ PostgreSQL is ready!"

# Clear all caches for development
echo "Clearing development caches..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# Run migrations and seed
echo "Setting up database..."
php artisan migrate --force
php artisan db:seed --force

echo "✅ Development environment ready!"
echo "🔥 Hot reload enabled for PHP files"
echo "📱 Access application at: http://localhost:8000"

# Start Apache in foreground
exec "$@"