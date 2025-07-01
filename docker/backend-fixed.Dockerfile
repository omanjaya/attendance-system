# Laravel Backend Dockerfile - Fixed
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
    libonig-dev \
    postgresql-client \
    curl \
    zip \
    unzip \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip gd bcmath opcache mbstring \
    && a2enmod rewrite headers \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy Apache configuration
COPY docker/apache-laravel.conf /etc/apache2/sites-available/000-default.conf

# Copy the backend application (excluding vendor and node_modules)
COPY backend/ /var/www/html/

# Create storage directories if they don't exist
RUN mkdir -p /var/www/html/storage/app/public \
    && mkdir -p /var/www/html/storage/framework/cache \
    && mkdir -p /var/www/html/storage/framework/sessions \
    && mkdir -p /var/www/html/storage/framework/views \
    && mkdir -p /var/www/html/storage/logs \
    && mkdir -p /var/www/html/bootstrap/cache \
    && mkdir -p /var/www/html/public

# Check if vendor directory exists, if not install dependencies
RUN if [ ! -d "/var/www/html/vendor" ]; then \
        composer install --no-dev --optimize-autoloader --no-scripts; \
    fi

# Generate Laravel key if .env exists
RUN if [ -f "/var/www/html/.env" ]; then \
        php artisan key:generate || true; \
    fi

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Create a healthcheck script
RUN echo '<?php echo "OK"; ?>' > /var/www/html/public/health.php

# Copy entrypoint script
COPY docker/entrypoint-laravel.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port 80
EXPOSE 80

# Use entrypoint for better initialization
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]