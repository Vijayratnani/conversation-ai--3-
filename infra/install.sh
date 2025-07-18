#!/bin/bash

# Exit on error
set -e

# Print welcome message
echo "==================================================="
echo "Conversation AI Installation Script"
echo "==================================================="
echo ""

# Ask for deployment method
echo "Please select a deployment method:"
echo "1) Standard deployment (systemd + Nginx)"
echo "2) Docker deployment"
read -p "Enter your choice (1/2): " deployment_choice

case $deployment_choice in
    1)
        echo "Starting standard deployment..."
        sudo bash deploy.sh
        ;;
    2)
        echo "Starting Docker deployment..."
        bash docker-deploy.sh
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "==================================================="
echo "Installation completed!"
echo "==================================================="
