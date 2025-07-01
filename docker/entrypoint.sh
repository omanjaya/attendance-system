#!/bin/bash
set -e

echo "Starting Laravel application setup..."

# Wait for database to be ready (if using external DB)
echo "Checking database connection..."

# Run Laravel setup commands
echo "Setting up Laravel application..."

# Generate app key if not exists
if [ ! -f /var/www/html/.env ]; then
    echo "Creating .env file..."
    cp /var/www/html/.env.example /var/www/html/.env
    php artisan key:generate
fi

# Ensure storage and cache directories exist with proper permissions
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

# Clear and cache Laravel configuration
echo "Optimizing Laravel application..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Seed the database
echo "Seeding database..."
php artisan db:seed --force

# Cache configuration for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set final permissions
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html

echo "Laravel application setup complete!"

# Execute the main command
exec "$@"