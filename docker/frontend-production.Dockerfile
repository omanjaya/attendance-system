# Multi-stage build for Vue.js production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY frontend/web/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY frontend/web/ .

# Build for production
RUN npm run build

# Production stage - Nginx
FROM nginx:alpine

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache \
    curl \
    && rm -rf /var/cache/apk/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /var/www/html

# Copy nginx configuration
COPY docker/nginx-production.conf /etc/nginx/nginx.conf

# Create nginx user and set permissions
RUN addgroup -g 1000 -S nginx-app && \
    adduser -S -D -H -u 1000 -h /var/cache/nginx -s /sbin/nologin -G nginx-app -g nginx-app nginx-app && \
    chown -R nginx-app:nginx-app /var/www/html && \
    chown -R nginx-app:nginx-app /var/cache/nginx && \
    chown -R nginx-app:nginx-app /var/log/nginx

# Create directories for SSL certificates (will be mounted)
RUN mkdir -p /etc/ssl/certs /etc/ssl/private && \
    chown -R nginx-app:nginx-app /etc/ssl

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Switch to non-root user
USER nginx-app

# Expose port
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]