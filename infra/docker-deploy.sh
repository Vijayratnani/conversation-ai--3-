#!/bin/bash

# Exit on error
set -e

# Print commands before executing
set -x

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker $USER
    echo "Docker installed. Please log out and log back in to use Docker without sudo."
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/download/v2.17.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose installed."
fi

# Create data directory
mkdir -p data

# Build and start the Docker containers
docker-compose up -d --build

echo "Conversation AI has been deployed successfully with Docker!"
echo "You can access it at http://localhost:3000"
