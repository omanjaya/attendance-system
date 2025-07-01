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
RUN chown -R www-data:www-data /var/www/html

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]