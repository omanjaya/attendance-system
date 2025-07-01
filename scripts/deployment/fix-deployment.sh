#!/bin/bash

# Fix deployment issues script
set -e

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
}

# Fix 1: Install Node.js 20
fix_nodejs() {
    log "Installing Node.js 20..."
    
    # Install NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    
    # Install Node.js
    sudo apt-get install -y nodejs
    
    # Verify installation
    node_version=$(node -v)
    success "Node.js installed: $node_version"
}

# Fix 2: Create backend .env file
create_backend_env() {
    log "Creating backend .env file..."
    
    if [[ ! -f "backend/.env" ]]; then
        cp .env.production.template backend/.env
        
        # Generate APP_KEY
        APP_KEY=$(openssl rand -base64 32)
        sed -i "s|GENERATE_NEW_KEY_HERE|$APP_KEY|g" backend/.env
        
        # Generate strong database password
        DB_PASS=$(openssl rand -base64 24)
        sed -i "s|CHANGE_THIS_STRONG_PASSWORD|$DB_PASS|g" backend/.env
        
        # Update domain
        DOMAIN=${1:-absensi.manufac.id}
        sed -i "s|your-domain.com|$DOMAIN|g" backend/.env
        
        # Generate webhook secret
        WEBHOOK_SECRET=$(openssl rand -base64 32)
        sed -i "s|GENERATE_WEBHOOK_SECRET_HERE|$WEBHOOK_SECRET|g" backend/.env
        
        success "Backend .env created"
    else
        warning "Backend .env already exists"
    fi
}

# Fix 3: Rebuild frontend with correct Node version
rebuild_frontend() {
    log "Rebuilding frontend..."
    
    cd frontend/web
    
    # Clean install
    rm -rf node_modules package-lock.json
    npm install
    
    # Build
    npm run build
    
    if [[ -d "dist" ]]; then
        success "Frontend built successfully"
    else
        error "Frontend build failed"
        return 1
    fi
    
    cd ../..
}

# Fix 4: Update docker-compose file with correct domain
update_docker_compose() {
    log "Updating Docker configuration..."
    
    DOMAIN=${1:-absensi.manufac.id}
    
    # Update nginx config
    if [[ -f "docker/nginx-hostinger.conf" ]]; then
        sed -i "s|your-domain.com|$DOMAIN|g" docker/nginx-hostinger.conf
    fi
    
    # Create face recognition .env
    if [[ ! -f "services/face-recognition-service/.env" ]]; then
        DB_PASS=$(grep DB_PASSWORD backend/.env | cut -d'=' -f2)
        cat > services/face-recognition-service/.env << EOF
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
        success "Face recognition service .env created"
    fi
}

# Fix 5: Install Docker if needed
ensure_docker() {
    if ! command -v docker &> /dev/null; then
        log "Installing Docker..."
        
        # Update system
        sudo apt-get update
        
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
        
        success "Docker installed"
        warning "Please logout and login again for docker group changes to take effect"
    else
        success "Docker is already installed"
    fi
}

# Main function
main() {
    DOMAIN=${1:-absensi.manufac.id}
    
    log "Fixing deployment issues for domain: $DOMAIN"
    
    # Change to project directory
    cd ~/attendance-system
    
    # Run fixes
    fix_nodejs
    create_backend_env $DOMAIN
    rebuild_frontend
    update_docker_compose $DOMAIN
    ensure_docker
    
    log "All fixes applied!"
    log ""
    log "Next steps:"
    log "1. Review backend/.env and update any settings as needed"
    log "2. Run the deployment with Docker:"
    log "   export DB_DATABASE=attendance_system"
    log "   export DB_USERNAME=attendance_user"
    log "   export DB_PASSWORD=\$(grep DB_PASSWORD backend/.env | cut -d'=' -f2)"
    log "   export USER=\$USER"
    log "   docker compose -f docker-compose.hostinger.yml up -d"
    log ""
    log "3. After containers start, run migrations:"
    log "   docker compose -f docker-compose.hostinger.yml exec backend php artisan migrate --force"
    log ""
    log "4. Create storage link:"
    log "   docker compose -f docker-compose.hostinger.yml exec backend php artisan storage:link"
}

# Run main
main "$@"