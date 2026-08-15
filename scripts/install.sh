#!/bin/bash
set -e

echo "Setting up RecipeVault development environment..."

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Install Go dependencies  
echo "Installing Go dependencies..."
cd api && go mod download && cd ..

# Install Docker
echo "Installing Docker..."
sudo apt-get update && sudo apt-get install -y docker.io

# Install Docker Compose plugin
echo "Installing Docker Compose plugin..."
sudo docker compose plugin install || \
    (curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o $(docker plugin ls 2>/dev/null | grep compose || echo "~/.docker/cli-plugins/docker-compose")/docker-compose)

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file from .env.example"
fi

echo "Setup complete!"
echo ""
echo "To start development:"
echo "  - Docker: docker-compose -f docker/docker-compose.yml up"
echo "  - API:   cd api && go run ./cmd/api"
echo "  - App:  nx serve app"