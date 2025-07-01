#!/bin/bash
set -e

echo "Starting Laravel setup..."

# Wait for database to be ready
echo "Waiting for database..."
until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_DATABASE" -c '\q' 2>/dev/null; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is up - continuing..."

# Check if vendor directory exists
if [ ! -d "/var/www/html/vendor" ]; then
    echo "Installing composer dependencies..."
    composer install --no-dev --optimize-autoloader
fi

# Create storage directories if they don't exist
mkdir -p storage/app/public
mkdir -p storage/framework/{cache,sessions,views}
mkdir -p storage/logs
mkdir -p bootstrap/cache

# Set permissions
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Generate app key if not exists
if ! grep -q "^APP_KEY=.\+" .env; then
    echo "Generating application key..."
    php artisan key:generate
fi

# Clear and cache config
echo "Clearing caches..."
php artisan config:clear || true
php artisan cache:clear || true
php artisan view:clear || true

# Create cache directory if it doesn't exist
mkdir -p storage/framework/cache/data
chown -R www-data:www-data storage/framework/cache

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Create storage link
echo "Creating storage link..."
php artisan storage:link || true

# Optimize for production
if [ "$APP_ENV" == "production" ]; then
    echo "Optimizing for production..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

echo "Laravel setup complete!"

# Start Apache
exec apache2-foreground