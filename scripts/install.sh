#!/bin/bash
set -e

echo "Setting up RecipeVault development environment..."

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Install Go dependencies  
echo "Installing Go dependencies..."
cd api && go mod download && cd ..

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