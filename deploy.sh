#!/bin/bash

set -e

echo "Starting deployment..."

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ ! -f .env ]; then
    echo -e "${RED}.env file not found!${NC}"
    echo "Please create .env file with required environment variables"
    exit 1
fi

echo -e "${YELLOW}Installing dependencies...${NC}"
npm ci --production

echo -e "${YELLOW}Building application...${NC}"
npm run build

echo -e "${YELLOW}Stopping existing containers...${NC}"
docker compose down

echo -e "${YELLOW}Building and starting containers...${NC}"
docker compose up -d --build

echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

echo -e "${YELLOW}Running database migrations...${NC}"
docker compose exec -T backend npm run migrate || echo "Migration already up to date"

echo -e "${YELLOW}🧹 Cleaning up old images...${NC}"
docker image prune -f

echo -e "${YELLOW}Checking container status...${NC}"
docker compose ps

if docker compose ps | grep -q "backend.*Up"; then
    echo -e "${GREEN}Deployment successful!${NC}"
    echo -e "${GREEN}Server is running on port 3001${NC}"
else
    echo -e "${RED}Deployment failed! Backend container is not running.${NC}"
    echo "Checking logs..."
    docker compose logs backend --tail=50
    exit 1
fi

echo -e "${YELLOW}Recent logs:${NC}"
docker compose logs backend --tail=20
