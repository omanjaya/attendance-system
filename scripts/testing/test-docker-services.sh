#!/bin/bash

# Docker Services Validation Script
echo "=== Docker Services Validation ==="
echo

# Function to check if Docker is installed and running
check_docker() {
    echo "1. Checking Docker Installation..."
    
    if command -v docker &> /dev/null; then
        echo "   ✅ Docker is installed"
        docker --version
    else
        echo "   ❌ Docker is not installed"
        return 1
    fi
    
    if command -v docker-compose &> /dev/null; then
        echo "   ✅ Docker Compose is installed"
        docker-compose --version
    else
        echo "   ❌ Docker Compose is not installed"
        return 1
    fi
    
    if docker info &> /dev/null; then
        echo "   ✅ Docker daemon is running"
    else
        echo "   ❌ Docker daemon is not running"
        return 1
    fi
    
    return 0
}

# Function to validate Docker configuration files
validate_docker_configs() {
    echo
    echo "2. Validating Docker Configuration Files..."
    
    configs=(
        "docker-compose.yml:Production configuration"
        "docker-compose.dev.yml:Development configuration"
        "docker/backend.Dockerfile:Laravel backend container"
        "docker/face-recognition.Dockerfile:Face recognition service container"
        "docker/frontend.Dockerfile:Vue.js frontend container"
        "docker/nginx.conf:Nginx reverse proxy configuration"
        "docker/init-db.sql:Database initialization script"
    )
    
    for config in "${configs[@]}"; do
        IFS=':' read -r file description <<< "$config"
        if [[ -f "$file" ]]; then
            echo "   ✅ $file: $description"
        else
            echo "   ❌ $file: Missing ($description)"
        fi
    done
}

# Function to test Docker Compose configuration
test_compose_config() {
    echo
    echo "3. Testing Docker Compose Configuration..."
    
    echo "   Testing development configuration..."
    if docker-compose -f docker-compose.dev.yml config --quiet; then
        echo "   ✅ Development docker-compose.dev.yml is valid"
    else
        echo "   ❌ Development docker-compose.dev.yml has configuration errors"
    fi
    
    echo "   Testing production configuration..."
    if docker-compose -f docker-compose.yml config --quiet; then
        echo "   ✅ Production docker-compose.yml is valid"
    else
        echo "   ❌ Production docker-compose.yml has configuration errors"
    fi
    
    echo "   Listing services in development configuration..."
    docker-compose -f docker-compose.dev.yml config --services | while read service; do
        echo "      - $service"
    done
}

# Function to test Docker build process
test_docker_build() {
    echo
    echo "4. Testing Docker Build Process..."
    
    # Test backend Dockerfile
    echo "   Testing backend Dockerfile..."
    if docker build -f docker/backend.Dockerfile -t attendance-backend-test . --no-cache --quiet; then
        echo "   ✅ Backend Dockerfile builds successfully"
        docker rmi attendance-backend-test &> /dev/null
    else
        echo "   ❌ Backend Dockerfile build failed"
    fi
    
    # Test face recognition Dockerfile
    echo "   Testing face recognition Dockerfile..."
    if docker build -f docker/face-recognition.Dockerfile -t attendance-face-test . --no-cache --quiet; then
        echo "   ✅ Face recognition Dockerfile builds successfully"
        docker rmi attendance-face-test &> /dev/null
    else
        echo "   ❌ Face recognition Dockerfile build failed"
    fi
    
    # Test frontend Dockerfile
    echo "   Testing frontend Dockerfile..."
    if docker build -f docker/frontend.Dockerfile -t attendance-frontend-test . --no-cache --quiet; then
        echo "   ✅ Frontend Dockerfile builds successfully"
        docker rmi attendance-frontend-test &> /dev/null
    else
        echo "   ❌ Frontend Dockerfile build failed"
    fi
}

# Function to test service startup
test_service_startup() {
    echo
    echo "5. Testing Service Startup..."
    
    echo "   Starting services with docker-compose..."
    if docker-compose -f docker-compose.dev.yml up -d --build; then
        echo "   ✅ Services started successfully"
        
        echo "   Waiting for services to initialize..."
        sleep 30
        
        echo "   Checking service status..."
        docker-compose -f docker-compose.dev.yml ps
        
        echo "   Testing service health..."
        services=(
            "http://localhost:8000:Backend API"
            "http://localhost:8001:Face Recognition Service"
            "http://localhost:5173:Frontend Application"
        )
        
        for service in "${services[@]}"; do
            IFS=':' read -r url description <<< "$service"
            if curl -f -s "$url" > /dev/null; then
                echo "   ✅ $description ($url) is responding"
            else
                echo "   ❌ $description ($url) is not responding"
            fi
        done
        
    else
        echo "   ❌ Services failed to start"
    fi
}

# Function to test inter-container communication
test_inter_container_communication() {
    echo
    echo "6. Testing Inter-Container Communication..."
    
    # Test database connectivity from backend
    echo "   Testing backend → database connection..."
    if docker-compose -f docker-compose.dev.yml exec -T backend php -r "
        try {
            \$pdo = new PDO('pgsql:host=postgres;port=5432;dbname=attendance_system', 'attendance_user', 'attendance_pass');
            echo 'Database connection successful';
        } catch (Exception \$e) {
            echo 'Database connection failed: ' . \$e->getMessage();
        }
    "; then
        echo "   ✅ Backend can connect to database"
    else
        echo "   ❌ Backend cannot connect to database"
    fi
    
    # Test face service connectivity from backend
    echo "   Testing backend → face service connection..."
    if docker-compose -f docker-compose.dev.yml exec -T backend curl -f -s http://face_service:8001/health > /dev/null; then
        echo "   ✅ Backend can connect to face recognition service"
    else
        echo "   ❌ Backend cannot connect to face recognition service"
    fi
    
    # Test face service → database connection
    echo "   Testing face service → database connection..."
    if docker-compose -f docker-compose.dev.yml exec -T face_service python -c "
import psycopg2
try:
    conn = psycopg2.connect(
        host='postgres',
        port=5432,
        database='attendance_system',
        user='attendance_user',
        password='attendance_pass'
    )
    print('Face service database connection successful')
    conn.close()
except Exception as e:
    print(f'Face service database connection failed: {e}')
    "; then
        echo "   ✅ Face service can connect to database"
    else
        echo "   ❌ Face service cannot connect to database"
    fi
}

# Function to check Docker logs
check_docker_logs() {
    echo
    echo "7. Checking Docker Service Logs..."
    
    services=("backend" "face_service" "frontend" "postgres")
    
    for service in "${services[@]}"; do
        echo "   Checking $service logs..."
        log_output=$(docker-compose -f docker-compose.dev.yml logs --tail=5 "$service" 2>/dev/null)
        if [[ -n "$log_output" ]]; then
            echo "   ✅ $service has log output"
            echo "$log_output" | sed 's/^/      /'
        else
            echo "   ⚠️  $service has no recent logs"
        fi
        echo
    done
}

# Function to cleanup Docker resources
cleanup_docker() {
    echo
    echo "8. Cleaning Up Docker Resources..."
    
    echo "   Stopping services..."
    docker-compose -f docker-compose.dev.yml down
    
    echo "   Removing unused containers..."
    docker container prune -f
    
    echo "   Removing unused images..."
    docker image prune -f
    
    echo "   ✅ Cleanup completed"
}

# Main execution
main() {
    cd "$(dirname "$0")"
    
    if check_docker; then
        validate_docker_configs
        test_compose_config
        
        # Only proceed with build and startup tests if Docker is working
        echo
        read -p "Do you want to proceed with Docker build and startup tests? (y/N): " -n 1 -r
        echo
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            test_docker_build
            test_service_startup
            test_inter_container_communication
            check_docker_logs
            
            echo
            read -p "Do you want to cleanup Docker resources? (y/N): " -n 1 -r
            echo
            
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                cleanup_docker
            fi
        fi
    else
        echo "❌ Docker is not properly installed or configured"
        exit 1
    fi
    
    echo
    echo "=== Docker Services Validation Complete ==="
}

# Run main function
main "$@"