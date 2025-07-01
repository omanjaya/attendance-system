#!/bin/bash

# VPS Deployment Script for Attendance System
# Usage: ./deploy.sh [environment] [domain]
# Example: ./deploy.sh production attendance.company.com

set -e

# Configuration
ENVIRONMENT=${1:-production}
DOMAIN=${2:-your-domain.com}
PROJECT_NAME="attendance-system"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root for security reasons"
    fi
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    # Check if Git is installed
    if ! command -v git &> /dev/null; then
        error "Git is not installed. Please install Git first."
    fi
    
    success "Prerequisites check passed"
}

# Create necessary directories
create_directories() {
    log "Creating necessary directories..."
    
    mkdir -p /home/$USER/ssl
    mkdir -p /home/$USER/backups
    mkdir -p /home/$USER/logs
    
    success "Directories created"
}

# Generate SSL certificates (self-signed for testing)
generate_ssl() {
    log "Generating SSL certificates..."
    
    if [[ ! -f "/home/$USER/ssl/$DOMAIN.crt" ]]; then
        warning "Generating self-signed SSL certificate for testing"
        warning "For production, replace with valid SSL certificates from Let's Encrypt or CA"
        
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout "/home/$USER/ssl/$DOMAIN.key" \
            -out "/home/$USER/ssl/$DOMAIN.crt" \
            -subj "/C=ID/ST=Jakarta/L=Jakarta/O=Company/OU=IT/CN=$DOMAIN"
        
        success "Self-signed SSL certificate generated"
    else
        log "SSL certificate already exists"
    fi
}

# Update environment files with domain
update_environment() {
    log "Updating environment configuration..."
    
    # Update backend .env.production
    if [[ -f "backend/.env.production" ]]; then
        sed -i "s/your-domain.com/$DOMAIN/g" backend/.env.production
        sed -i "s/CHANGE_THIS_PASSWORD/$(openssl rand -base64 32)/g" backend/.env.production
        sed -i "s/GENERATE_NEW_KEY_HERE/$(openssl rand -base64 32)/g" backend/.env.production
        success "Backend environment updated"
    fi
    
    # Update frontend .env.production
    if [[ -f "frontend/web/.env.production" ]]; then
        sed -i "s/your-domain.com/$DOMAIN/g" frontend/web/.env.production
        success "Frontend environment updated"
    fi
    
    # Update nginx configuration
    if [[ -f "docker/nginx-production.conf" ]]; then
        sed -i "s/your-domain.com/$DOMAIN/g" docker/nginx-production.conf
        success "Nginx configuration updated"
    fi
    
    # Update docker-compose.prod.yml
    if [[ -f "$DOCKER_COMPOSE_FILE" ]]; then
        sed -i "s/your-domain.com/$DOMAIN/g" $DOCKER_COMPOSE_FILE
        success "Docker Compose configuration updated"
    fi
}

# Build and deploy containers
deploy_containers() {
    log "Building and deploying containers..."
    
    # Stop existing containers
    docker-compose -f $DOCKER_COMPOSE_FILE down || true
    
    # Remove old images
    docker system prune -f || true
    
    # Build new images
    docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache
    
    # Start containers
    docker-compose -f $DOCKER_COMPOSE_FILE up -d
    
    success "Containers deployed successfully"
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    # Wait for database to be ready
    sleep 30
    
    # Run migrations
    docker-compose -f $DOCKER_COMPOSE_FILE exec -T backend php artisan migrate --force
    
    success "Database migrations completed"
}

# Setup cron jobs for maintenance
setup_cron() {
    log "Setting up cron jobs..."
    
    # Create backup script
    cat > /home/$USER/backup.sh << EOF
#!/bin/bash
BACKUP_DIR="/home/$USER/backups"
DATE=\$(date +%Y%m%d_%H%M%S)

# Database backup
docker exec attendance_postgres_prod pg_dump -U attendance_user attendance_system > \$BACKUP_DIR/db_backup_\$DATE.sql

# Keep only last 7 days of backups
find \$BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete

# Docker system cleanup
docker system prune -f > /dev/null 2>&1
EOF
    
    chmod +x /home/$USER/backup.sh
    
    # Add to crontab (daily backup at 2 AM)
    (crontab -l 2>/dev/null; echo "0 2 * * * /home/$USER/backup.sh") | crontab -
    
    success "Cron jobs configured"
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Wait for services to start
    sleep 60
    
    # Check if containers are running
    if docker-compose -f $DOCKER_COMPOSE_FILE ps | grep -q "Up"; then
        success "Containers are running"
    else
        error "Some containers failed to start"
    fi
    
    # Check web accessibility
    if curl -f -s "http://localhost:8000/api/health" > /dev/null; then
        success "Backend API is accessible"
    else
        warning "Backend API health check failed"
    fi
    
    success "Health check completed"
}

# Main deployment function
main() {
    log "Starting deployment of $PROJECT_NAME to $ENVIRONMENT environment"
    log "Domain: $DOMAIN"
    
    check_root
    check_prerequisites
    create_directories
    generate_ssl
    update_environment
    deploy_containers
    run_migrations
    setup_cron
    health_check
    
    success "Deployment completed successfully!"
    log "Access your application at: https://$DOMAIN"
    log "Backend API: https://$DOMAIN/api"
    log "Face Recognition: https://$DOMAIN/face-api"
    
    warning "IMPORTANT:"
    warning "1. Replace self-signed SSL certificates with valid ones for production"
    warning "2. Configure firewall to allow only necessary ports (80, 443)"
    warning "3. Set up monitoring and log rotation"
    warning "4. Configure backup strategy for production data"
    warning "5. Review and update security settings"
}

# Run main function
main "$@"