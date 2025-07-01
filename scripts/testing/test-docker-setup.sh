#!/bin/bash

echo "🐳 Testing Docker Setup for Attendance System"
echo "============================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check command success
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
        return 1
    fi
}

# Stop any running containers
echo -e "\n${YELLOW}1. Stopping existing containers...${NC}"
docker-compose -f docker-compose.simple.yml down 2>/dev/null
check_status "Containers stopped"

# Build containers
echo -e "\n${YELLOW}2. Building containers...${NC}"
docker-compose -f docker-compose.simple.yml build --no-cache
check_status "Containers built"

# Start containers
echo -e "\n${YELLOW}3. Starting containers...${NC}"
docker-compose -f docker-compose.simple.yml up -d
check_status "Containers started"

# Wait for services to be ready
echo -e "\n${YELLOW}4. Waiting for services to be ready...${NC}"
sleep 10

# Check PostgreSQL
echo -e "\n${YELLOW}5. Checking PostgreSQL...${NC}"
docker exec attendance_postgres pg_isready -U attendance_user -d attendance_system
check_status "PostgreSQL is ready"

# Check Laravel backend
echo -e "\n${YELLOW}6. Checking Laravel backend...${NC}"
curl -f -s http://localhost:8000/health.php > /dev/null
check_status "Laravel backend is responding"

# Check API endpoint
echo -e "\n${YELLOW}7. Checking API endpoint...${NC}"
API_RESPONSE=$(curl -s http://localhost:8000/api/v1)
if [[ $API_RESPONSE == *"API endpoint not found"* ]]; then
    echo -e "${GREEN}✅ API is responding correctly${NC}"
else
    echo -e "${RED}❌ API is not responding as expected${NC}"
fi

# Check frontend
echo -e "\n${YELLOW}8. Checking frontend...${NC}"
FRONTEND_CHECK=$(docker exec attendance_frontend npm --version 2>/dev/null)
if [ ! -z "$FRONTEND_CHECK" ]; then
    echo -e "${GREEN}✅ Frontend container is running${NC}"
else
    echo -e "${RED}❌ Frontend container issue${NC}"
fi

# Show container status
echo -e "\n${YELLOW}9. Container Status:${NC}"
docker-compose -f docker-compose.simple.yml ps

# Show logs if needed
echo -e "\n${YELLOW}10. Recent backend logs:${NC}"
docker logs attendance_backend --tail 20

echo -e "\n${YELLOW}Test Complete!${NC}"
echo "============================================"
echo -e "\n${GREEN}Access the application:${NC}"
echo "- Backend: http://localhost:8000"
echo "- Frontend: http://localhost:5173"
echo "- PostgreSQL: localhost:5432"

echo -e "\n${GREEN}Useful commands:${NC}"
echo "- View logs: docker-compose -f docker-compose.simple.yml logs -f"
echo "- Stop all: docker-compose -f docker-compose.simple.yml down"
echo "- Restart: docker-compose -f docker-compose.simple.yml restart"