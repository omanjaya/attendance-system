#!/bin/bash

# School Attendance System Docker Deployment Script
echo "🏫 School Attendance System - Docker Deployment"
echo "================================================="

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Error: Docker is not running. Please start Docker first."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose > /dev/null 2>&1; then
        echo "❌ Error: docker-compose is not installed."
        exit 1
    fi
    echo "✅ Docker Compose is available"
}

# Function to build and start containers
start_containers() {
    echo "🔨 Building Docker images..."
    docker-compose build --no-cache
    
    echo "🚀 Starting containers..."
    docker-compose up -d
    
    echo "⏳ Waiting for services to be ready..."
    sleep 30
    
    echo "🔍 Checking container status..."
    docker-compose ps
}

# Function to start development environment with hot reload
start_dev() {
    echo "🔥 Starting development environment with hot reload..."
    docker-compose -f docker-compose.dev.yml build --no-cache
    docker-compose -f docker-compose.dev.yml up -d
    
    echo "⏳ Waiting for services to be ready..."
    sleep 30
    
    echo "🔍 Checking container status..."
    docker-compose -f docker-compose.dev.yml ps
}

# Function to show service URLs
show_urls() {
    echo ""
    echo "🌐 Service URLs:"
    echo "================================"
    echo "📱 Main Application (Nginx): http://localhost"
    echo "🔧 Laravel App Direct: http://localhost:8000"
    echo "👤 Face Recognition Service: http://localhost:8001"
    echo ""
    echo "👥 Demo Login Credentials:"
    echo "================================"
    echo "Super Admin: superadmin@school.edu / password123"
    echo "HR Manager: hr@school.edu / password123"
    echo "Principal: principal@school.edu / password123"
    echo "Teacher: teacher@school.edu / password123"
    echo "Staff: staff@school.edu / password123"
    echo "Accountant: accountant@school.edu / password123"
    echo "Honorary Teacher: honorary.teacher@school.edu / password123"
    echo "Honorary Staff: honorary.staff@school.edu / password123"
}

# Function to show logs
show_logs() {
    echo "📋 Recent logs:"
    docker-compose logs --tail=50
}

# Function to stop containers
stop_containers() {
    echo "🛑 Stopping containers..."
    docker-compose down
    echo "✅ All containers stopped"
}

# Function to restart containers
restart_containers() {
    echo "🔄 Restarting containers..."
    docker-compose restart
    echo "✅ All containers restarted"
}

# Main script logic
case "$1" in
    "start")
        check_docker
        check_docker_compose
        start_containers
        show_urls
        ;;
    "dev")
        check_docker
        check_docker_compose
        start_dev
        echo ""
        echo "🔥 Development Environment URLs:"
        echo "================================"
        echo "📱 Laravel App: http://localhost:8000 (with hot reload)"
        echo "👤 Face Recognition: http://localhost:8001 (with hot reload)"
        echo "⚡ Vite Dev Server: http://localhost:5173 (with HMR)"
        echo "🐘 PostgreSQL Database: localhost:5432"
        echo ""
        echo "🔥 Hot Reload Features:"
        echo "• PHP/Laravel files reload automatically"
        echo "• Python FastAPI reloads on file changes"
        echo "• Frontend assets have Hot Module Replacement (HMR)"
        ;;
    "stop")
        stop_containers
        ;;
    "stop-dev")
        echo "🛑 Stopping development containers..."
        docker-compose -f docker-compose.dev.yml down
        echo "✅ Development containers stopped"
        ;;
    "restart")
        restart_containers
        ;;
    "logs")
        show_logs
        ;;
    "logs-dev")
        echo "📋 Development logs:"
        docker-compose -f docker-compose.dev.yml logs --tail=50
        ;;
    "status")
        docker-compose ps
        ;;
    "status-dev")
        docker-compose -f docker-compose.dev.yml ps
        ;;
    "clean")
        echo "🧹 Cleaning up Docker resources..."
        docker-compose down -v
        docker-compose -f docker-compose.dev.yml down -v
        docker system prune -f
        echo "✅ Cleanup complete"
        ;;
    *)
        echo "Usage: $0 {start|dev|stop|stop-dev|restart|logs|logs-dev|status|status-dev|clean}"
        echo ""
        echo "Production Commands:"
        echo "  start     - Build and start production containers"
        echo "  stop      - Stop production containers"
        echo "  restart   - Restart production containers"
        echo "  logs      - Show production logs"
        echo "  status    - Show production container status"
        echo ""
        echo "Development Commands:"
        echo "  dev       - Start development environment with hot reload"
        echo "  stop-dev  - Stop development containers"
        echo "  logs-dev  - Show development logs"
        echo "  status-dev- Show development container status"
        echo ""
        echo "Utility Commands:"
        echo "  clean     - Stop all containers and clean up Docker resources"
        exit 1
        ;;
esac