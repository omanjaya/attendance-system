# Laravel Backend Dockerfile
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Install essential dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    postgresql-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_pgsql zip gd \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy Apache configuration
COPY docker/apache-minimal.conf /etc/apache2/sites-available/000-default.conf

# Copy the entire Laravel application first  
COPY backend/ /var/www/html/

# Install PHP dependencies with no scripts to avoid artisan issues
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Set proper permissions after installation
RUN mkdir -p /var/www/html/storage/logs \
    && mkdir -p /var/www/html/storage/framework/cache \
    && mkdir -p /var/www/html/storage/framework/sessions \
    && mkdir -p /var/www/html/storage/framework/views \
    && mkdir -p /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html/storage \
    && chown -R www-data:www-data /var/www/html/bootstrap/cache

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
