#!/bin/bash

# Exit on error
set -e

# Print commands before executing
set -x

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root or with sudo"
  exit 1
fi

# Update package lists
apt-get update

# Install required packages
apt-get install -y curl git nginx

# Install Node.js if not already installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Create application directory
mkdir -p /opt/conversation-ai
cd /opt/conversation-ai

# Clone the repository (replace with your actual repository URL)
# If directory is not empty, pull latest changes
if [ "$(ls -A /opt/conversation-ai)" ]; then
    git pull
else
    git clone https://github.com/yourusername/conversation-ai.git .
fi

# Install dependencies
npm ci

# Build the application
npm run build

# Copy systemd service file
cp conversation-ai.service /etc/systemd/system/

# Reload systemd
systemctl daemon-reload

# Enable and start the service
systemctl enable conversation-ai
systemctl restart conversation-ai

# Configure Nginx
cp nginx.conf /etc/nginx/sites-available/conversation-ai
ln -sf /etc/nginx/sites-available/conversation-ai /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

echo "Conversation AI has been deployed successfully!"
echo "You can access it at http://conversation-ai.example.com"
