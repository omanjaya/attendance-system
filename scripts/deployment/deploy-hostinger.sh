#!/bin/bash

# Hostinger VPS Deployment Script for Attendance System
# Optimized for Hostinger VPS environment
# Usage: ./deploy-hostinger.sh [domain]
# Example: ./deploy-hostinger.sh attendance.yourdomain.com

set -e

# Configuration
DOMAIN=${1:-your-domain.com}
PROJECT_NAME="attendance-system"
DOCKER_COMPOSE_FILE="docker-compose.hostinger.yml"
DEPLOY_USER=$(whoami)
DEPLOY_PATH="/home/$DEPLOY_USER/$PROJECT_NAME"

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

# Check system requirements
check_system() {
    log "Checking system requirements..."
    
    # Check OS
    if [[ ! -f /etc/os-release ]]; then
        error "Cannot determine OS version"
    fi
    
    . /etc/os-release
    log "Operating System: $NAME $VERSION"
    
    # Check available memory
    TOTAL_MEM=$(free -m | awk 'NR==2{print $2}')
    if [[ $TOTAL_MEM -lt 2048 ]]; then
        warning "Low memory detected: ${TOTAL_MEM}MB. Recommended: 4GB+"
    else
        success "Memory check passed: ${TOTAL_MEM}MB"
    fi
    
    # Check available disk space
    DISK_USAGE=$(df -h / | awk 'NR==2{print $5}' | sed 's/%//')
    if [[ $DISK_USAGE -gt 80 ]]; then
        warning "High disk usage: ${DISK_USAGE}%"
    else
        success "Disk space check passed: ${DISK_USAGE}% used"
    fi
}

# Install Docker if not present
install_docker() {
    if ! command -v docker &> /dev/null; then
        log "Installing Docker..."
        
        # Update system
        sudo apt-get update
        sudo apt-get upgrade -y
        
        # Install dependencies
        sudo apt-get install -y \
            apt-transport-https \
            ca-certificates \
            curl \
            gnupg \
            lsb-release
        
        # Add Docker GPG key
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        
        # Add Docker repository
        echo \
            "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
            $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        
        # Install Docker
        sudo apt-get update
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        
        # Add user to docker group
        sudo usermod -aG docker $USER
        
        success "Docker installed successfully"
        warning "Please log out and back in for docker group changes to take effect"
    else
        success "Docker is already installed"
    fi
}

# Configure firewall
configure_firewall() {
    log "Configuring firewall..."
    
    if command -v ufw &> /dev/null; then
        sudo ufw --force enable
        sudo ufw allow 22/tcp    # SSH
        sudo ufw allow 80/tcp    # HTTP
        sudo ufw allow 443/tcp   # HTTPS
        sudo ufw reload
        success "Firewall configured"
    else
        warning "UFW not found, please configure firewall manually"
    fi
}

# Setup SSL with Let's Encrypt
setup_ssl() {
    log "Setting up SSL certificates..."
    
    SSL_DIR="/home/$DEPLOY_USER/ssl"
    mkdir -p $SSL_DIR
    
    # Check if certbot is installed
    if ! command -v certbot &> /dev/null; then
        log "Installing Certbot..."
        sudo apt-get update
        sudo apt-get install -y certbot
    fi
    
    # Generate certificate
    if [[ ! -f "$SSL_DIR/cert.pem" ]]; then
        warning "For production, you should obtain a valid SSL certificate"
        warning "Run: sudo certbot certonly --standalone -d $DOMAIN"
        
        # Generate self-signed for now
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout "$SSL_DIR/key.pem" \
            -out "$SSL_DIR/cert.pem" \
            -subj "/C=ID/ST=Jakarta/L=Jakarta/O=Company/OU=IT/CN=$DOMAIN"
        
        chmod 600 "$SSL_DIR/key.pem"
        success "Self-signed certificate generated (replace with Let's Encrypt for production)"
    fi
}

# Prepare environment files
prepare_environment() {
    log "Preparing environment configuration..."
    
    # Backend environment
    if [[ ! -f "$DEPLOY_PATH/backend/.env" ]]; then
        cp "$DEPLOY_PATH/.env.production.template" "$DEPLOY_PATH/backend/.env"
        
        # Generate APP_KEY
        APP_KEY=$(openssl rand -base64 32)
        sed -i "s|GENERATE_NEW_KEY_HERE|$APP_KEY|g" "$DEPLOY_PATH/backend/.env"
        
        # Generate strong database password
        DB_PASS=$(openssl rand -base64 24)
        sed -i "s|CHANGE_THIS_STRONG_PASSWORD|$DB_PASS|g" "$DEPLOY_PATH/backend/.env"
        
        # Update domain
        sed -i "s|your-domain.com|$DOMAIN|g" "$DEPLOY_PATH/backend/.env"
        
        # Generate webhook secret
        WEBHOOK_SECRET=$(openssl rand -base64 32)
        sed -i "s|GENERATE_WEBHOOK_SECRET_HERE|$WEBHOOK_SECRET|g" "$DEPLOY_PATH/backend/.env"
        
        success "Backend environment configured"
    fi
    
    # Frontend environment
    if [[ ! -f "$DEPLOY_PATH/frontend/web/.env.production" ]]; then
        cat > "$DEPLOY_PATH/frontend/web/.env.production" << EOF
VITE_APP_NAME="Attendance System"
VITE_API_URL=https://$DOMAIN/api
VITE_FACE_API_URL=https://$DOMAIN/face-api
VITE_APP_URL=https://$DOMAIN
EOF
        success "Frontend environment configured"
    fi
    
    # Face recognition service environment
    if [[ ! -f "$DEPLOY_PATH/services/face-recognition-service/.env" ]]; then
        cat > "$DEPLOY_PATH/services/face-recognition-service/.env" << EOF
ENVIRONMENT=production
DATABASE_URL=postgresql://attendance_user:$DB_PASS@postgres:5432/attendance_system
REDIS_URL=redis://redis:6379/1
APP_HOST=0.0.0.0
APP_PORT=8001
LOG_LEVEL=INFO
MAX_FACES_PER_IMAGE=5
FACE_DETECTION_CONFIDENCE=0.7
FACE_RECOGNITION_TOLERANCE=0.6
EOF
        success "Face recognition service environment configured"
    fi
}

# Build and deploy
deploy_application() {
    log "Building and deploying application..."
    
    cd "$DEPLOY_PATH"
    
    # Build frontend
    log "Building frontend..."
    cd frontend/web
    npm install --production
    npm run build
    cd ../..
    
    # Update docker-compose with environment variables
    export DB_DATABASE="attendance_system"
    export DB_USERNAME="attendance_user"
    export DB_PASSWORD=$(grep DB_PASSWORD backend/.env | cut -d'=' -f2)
    export USER=$DEPLOY_USER
    
    # Stop existing containers
    docker compose -f $DOCKER_COMPOSE_FILE down || true
    
    # Build and start services
    docker compose -f $DOCKER_COMPOSE_FILE build --no-cache
    docker compose -f $DOCKER_COMPOSE_FILE up -d
    
    success "Application deployed"
}

# Run post-deployment tasks
post_deployment() {
    log "Running post-deployment tasks..."
    
    # Wait for services to start
    sleep 30
    
    # Run migrations
    docker compose -f $DOCKER_COMPOSE_FILE exec -T backend php artisan migrate --force
    
    # Generate storage link
    docker compose -f $DOCKER_COMPOSE_FILE exec -T backend php artisan storage:link
    
    # Clear and cache config
    docker compose -f $DOCKER_COMPOSE_FILE exec -T backend php artisan config:cache
    docker compose -f $DOCKER_COMPOSE_FILE exec -T backend php artisan route:cache
    docker compose -f $DOCKER_COMPOSE_FILE exec -T backend php artisan view:cache
    
    # Set permissions
    docker compose -f $DOCKER_COMPOSE_FILE exec -T backend chown -R www-data:www-data storage bootstrap/cache
    
    success "Post-deployment tasks completed"
}

# Setup monitoring and backups
setup_monitoring() {
    log "Setting up monitoring and backups..."
    
    # Create backup script
    cat > "$DEPLOY_PATH/backup.sh" << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/'$DEPLOY_USER'/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
docker exec attendance_postgres pg_dump -U attendance_user attendance_system | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Application files backup
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz \
    -C /home/'$DEPLOY_USER'/'$PROJECT_NAME' \
    backend/storage/app/public \
    services/face-recognition-service/storage

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

# Log backup status
echo "[$(date)] Backup completed" >> $BACKUP_DIR/backup.log
EOF
    
    chmod +x "$DEPLOY_PATH/backup.sh"
    
    # Add to crontab
    (crontab -l 2>/dev/null; echo "0 2 * * * $DEPLOY_PATH/backup.sh") | crontab -
    
    # Create health check script
    cat > "$DEPLOY_PATH/health-check.sh" << 'EOF'
#!/bin/bash
# Health check script

# Check if all containers are running
if ! docker compose -f '$DOCKER_COMPOSE_FILE' ps | grep -q "Up"; then
    echo "Some containers are down, restarting..."
    docker compose -f '$DOCKER_COMPOSE_FILE' up -d
fi

# Check API endpoint
if ! curl -f -s "http://localhost/api/health" > /dev/null; then
    echo "API health check failed"
    # You can add notification logic here
fi
EOF
    
    chmod +x "$DEPLOY_PATH/health-check.sh"
    
    # Add health check to crontab (every 5 minutes)
    (crontab -l 2>/dev/null; echo "*/5 * * * * $DEPLOY_PATH/health-check.sh") | crontab -
    
    success "Monitoring and backups configured"
}

# Main deployment function
main() {
    log "Starting Hostinger VPS deployment for $PROJECT_NAME"
    log "Domain: $DOMAIN"
    
    check_system
    install_docker
    configure_firewall
    
    # Clone or update repository
    if [[ ! -d "$DEPLOY_PATH" ]]; then
        log "Cloning repository..."
        git clone https://github.com/yourusername/attendance-system.git "$DEPLOY_PATH"
    else
        log "Updating repository..."
        cd "$DEPLOY_PATH"
        git pull origin main
    fi
    
    cd "$DEPLOY_PATH"
    
    setup_ssl
    prepare_environment
    deploy_application
    post_deployment
    setup_monitoring
    
    success "Deployment completed successfully!"
    
    echo ""
    echo "==================================="
    echo "Deployment Summary:"
    echo "==================================="
    echo "Application URL: https://$DOMAIN"
    echo "Backend API: https://$DOMAIN/api"
    echo "Face Recognition: https://$DOMAIN/face-api"
    echo ""
    echo "Next Steps:"
    echo "1. Update DNS records to point to this server"
    echo "2. Replace self-signed SSL with Let's Encrypt:"
    echo "   sudo certbot certonly --standalone -d $DOMAIN"
    echo "3. Update SSL paths in docker-compose.hostinger.yml"
    echo "4. Monitor logs: docker compose -f $DOCKER_COMPOSE_FILE logs -f"
    echo "5. Check application health: https://$DOMAIN/health"
    echo ""
    echo "Security Reminders:"
    echo "- Change default passwords in .env files"
    echo "- Configure proper backup retention"
    echo "- Set up monitoring alerts"
    echo "- Review firewall rules"
    echo "==================================="
}

# Run main function
main "$@"