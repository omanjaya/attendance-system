#!/bin/bash

# CI/CD Setup Script for Attendance System
# This script sets up automated deployment from Git repository

set -e

# Configuration
PROJECT_PATH="/var/www/attendance-system"
WEBHOOK_PORT="3000"
WEBHOOK_SECRET=$(openssl rand -base64 32)
DOMAIN=${1:-"your-domain.com"}
GIT_REPO=${2:-"https://github.com/your-username/attendance-system.git"}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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
if [[ $EUID -eq 0 ]]; then
    error "This script should not be run as root"
fi

# Install required packages
install_dependencies() {
    log "Installing required packages..."
    
    sudo apt update
    sudo apt install -y curl git nginx nodejs npm python3 python3-pip
    
    # Install PM2 for process management
    sudo npm install -g pm2
    
    success "Dependencies installed"
}

# Setup SSH keys for Git
setup_ssh_keys() {
    log "Setting up SSH keys for Git..."
    
    if [[ ! -f ~/.ssh/id_rsa ]]; then
        ssh-keygen -t rsa -b 4096 -C "deployment@${DOMAIN}" -f ~/.ssh/id_rsa -N ""
        success "SSH key generated"
        
        echo -e "\n${YELLOW}Add this public key to your Git repository:${NC}"
        echo "========================================"
        cat ~/.ssh/id_rsa.pub
        echo "========================================"
        echo -e "${YELLOW}Add it to: GitHub/GitLab Settings → SSH Keys${NC}\n"
        
        read -p "Press Enter after adding the SSH key to continue..."
    else
        log "SSH key already exists"
    fi
}

# Clone repository
clone_repository() {
    log "Cloning repository..."
    
    if [[ ! -d "$PROJECT_PATH" ]]; then
        sudo mkdir -p /var/www
        sudo chown -R $USER:$USER /var/www
        
        git clone "$GIT_REPO" "$PROJECT_PATH"
        cd "$PROJECT_PATH"
        
        success "Repository cloned"
    else
        log "Repository already exists, pulling latest changes..."
        cd "$PROJECT_PATH"
        git pull origin main || git pull origin master
    fi
}

# Setup webhook server
setup_webhook_server() {
    log "Setting up webhook server..."
    
    cd "$PROJECT_PATH"
    
    # Install webhook dependencies
    npm install
    
    # Create environment file for webhook
    cat > .env.webhook << EOF
WEBHOOK_PORT=$WEBHOOK_PORT
WEBHOOK_SECRET=$WEBHOOK_SECRET
PROJECT_PATH=$PROJECT_PATH
NODE_ENV=production
EOF
    
    # Create PM2 ecosystem file
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'attendance-webhook',
    script: 'webhook-server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      WEBHOOK_PORT: $WEBHOOK_PORT,
      WEBHOOK_SECRET: '$WEBHOOK_SECRET',
      PROJECT_PATH: '$PROJECT_PATH'
    }
  }]
}
EOF
    
    # Start webhook server with PM2
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    
    success "Webhook server configured"
}

# Configure Nginx
configure_nginx() {
    log "Configuring Nginx..."
    
    # Create Nginx configuration
    sudo tee /etc/nginx/sites-available/attendance-system << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Webhook endpoint
    location /webhook {
        proxy_pass http://localhost:$WEBHOOK_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:$WEBHOOK_PORT;
        proxy_set_header Host \$host;
    }
    
    # Main application (will be configured later)
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/attendance-system /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test and reload Nginx
    sudo nginx -t
    sudo systemctl reload nginx
    
    success "Nginx configured"
}

# Setup firewall
setup_firewall() {
    log "Configuring firewall..."
    
    sudo ufw allow ssh
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    
    success "Firewall configured"
}

# Create deployment script
create_deployment_script() {
    log "Creating enhanced deployment script..."
    
    cat > "$PROJECT_PATH/deploy-auto.sh" << 'EOF'
#!/bin/bash

# Automated deployment script
set -e

PROJECT_PATH="/var/www/attendance-system"
BACKUP_DIR="/var/backups/attendance-system"

cd "$PROJECT_PATH"

# Create backup
mkdir -p "$BACKUP_DIR"
BACKUP_NAME="backup-$(date +%Y%m%d_%H%M%S)"
cp -r . "$BACKUP_DIR/$BACKUP_NAME"

# Keep only last 5 backups
ls -t "$BACKUP_DIR" | tail -n +6 | xargs -r rm -rf

# Pull latest changes
git fetch --all
git reset --hard origin/main

# Backend deployment
cd backend
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Frontend deployment
cd ../frontend/web
npm ci --only=production
npm run build

# Restart services
cd ../..
if [ -f "docker-compose.prod.yml" ]; then
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml up -d --build
fi

# Health check
sleep 10
curl -f http://localhost:8000/api/health || {
    echo "Health check failed, rolling back..."
    cp -r "$BACKUP_DIR/$BACKUP_NAME/." .
    exit 1
}

echo "Deployment completed successfully!"
EOF
    
    chmod +x "$PROJECT_PATH/deploy-auto.sh"
    
    success "Deployment script created"
}

# Setup monitoring
setup_monitoring() {
    log "Setting up monitoring..."
    
    # Create log rotation
    sudo tee /etc/logrotate.d/attendance-system << EOF
$PROJECT_PATH/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
EOF
    
    # Setup PM2 monitoring
    pm2 install pm2-logrotate
    pm2 set pm2-logrotate:max_size 10M
    pm2 set pm2-logrotate:retain 7
    
    success "Monitoring configured"
}

# Display setup information
display_info() {
    log "CI/CD Setup completed!"
    
    echo -e "\n${GREEN}=== SETUP INFORMATION ===${NC}"
    echo "Project Path: $PROJECT_PATH"
    echo "Webhook URL: http://$DOMAIN/webhook"
    echo "Health Check: http://$DOMAIN/health"
    echo "Webhook Secret: $WEBHOOK_SECRET"
    
    echo -e "\n${YELLOW}=== GITHUB WEBHOOK SETUP ===${NC}"
    echo "1. Go to your GitHub repository"
    echo "2. Settings → Webhooks → Add webhook"
    echo "3. Payload URL: http://$DOMAIN/webhook"
    echo "4. Content type: application/json"
    echo "5. Secret: $WEBHOOK_SECRET"
    echo "6. Select 'Just the push event'"
    
    echo -e "\n${YELLOW}=== GITHUB ACTIONS SECRETS ===${NC}"
    echo "Add these secrets to GitHub repository:"
    echo "VPS_HOST: $(curl -s ifconfig.me)"
    echo "VPS_USERNAME: $USER"
    echo "VPS_SSH_KEY: (content of ~/.ssh/id_rsa)"
    echo "VPS_PORT: 22"
    
    echo -e "\n${YELLOW}=== TESTING ===${NC}"
    echo "Test webhook: curl -X POST http://$DOMAIN/health"
    echo "Manual deployment: curl -X POST -H 'Authorization: Bearer $WEBHOOK_SECRET' http://$DOMAIN/deploy"
    
    echo -e "\n${GREEN}Save this information securely!${NC}"
}

# Main execution
main() {
    log "Starting CI/CD setup for Attendance System"
    
    install_dependencies
    setup_ssh_keys
    clone_repository
    setup_webhook_server
    configure_nginx
    setup_firewall
    create_deployment_script
    setup_monitoring
    display_info
    
    success "CI/CD setup completed successfully!"
}

# Run main function
main "$@"