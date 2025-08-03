#!/bin/bash

# Define emulator ports
UI_PORT=4000
FUNCTIONS_PORT=5001

# Tunnel names
UI_TUNNEL_NAME="firebase-ui-tunnel"
FUNCTIONS_TUNNEL_NAME="firebase-fn-tunnel"

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null
then
    echo "cloudflared could not be found, installing it..."
    # Add installation steps for your specific OS
    # Example for Debian/Ubuntu:
    # curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
    # chmod +x cloudflared
    # sudo mv cloudflared /usr/local/bin/
    echo "Please install cloudflared manually and rerun the script."
    echo "Refer to: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/"
    exit 1
fi

echo "cloudflared is installed."

# Check if a tunnel already exists with the same name
if cloudflared tunnel list | grep -q "$UI_TUNNEL_NAME"; then
    echo "Tunnel '$UI_TUNNEL_NAME' already exists. Skipping creation."
else
    echo "Creating tunnel '$UI_TUNNEL_NAME' for Emulator UI on port $UI_PORT..."
    cloudflared tunnel create "$UI_TUNNEL_NAME"
fi

if cloudflared tunnel list | grep -q "$FUNCTIONS_TUNNEL_NAME"; then
    echo "Tunnel '$FUNCTIONS_TUNNEL_NAME' already exists. Skipping creation."
else
    echo "Creating tunnel '$FUNCTIONS_TUNNEL_NAME' for Firebase Functions on port $FUNCTIONS_PORT..."
    cloudflared tunnel create "$FUNCTIONS_TUNNEL_NAME"
fi


echo "Starting tunnels..."

# Start the UI tunnel in the background
echo "Starting tunnel '$UI_TUNNEL_NAME' on port $UI_PORT..."
cloudflared tunnel run --url "http://localhost:$UI_PORT" "$UI_TUNNEL_NAME" &
UI_TUNNEL_PID=$!
echo "UI tunnel process ID: $UI_TUNNEL_PID"

# Start the Functions tunnel in the background
echo "Starting tunnel '$FUNCTIONS_TUNNEL_NAME' on port $FUNCTIONS_PORT..."
cloudflared tunnel run --url "http://localhost:$FUNCTIONS_PORT" "$FUNCTIONS_TUNNEL_NAME" &
FUNCTIONS_TUNNEL_PID=$!
echo "Functions tunnel process ID: $FUNCTIONS_TUNNEL_PID"

echo ""
echo "Cloudflare tunnels for Firebase emulators are starting..."
echo "Keep this script running to keep the tunnels active."
echo ""
echo "To access the Emulator UI tunnel:"
echo "1. Configure your browser or application to use the hostname provided by Cloudflare for tunnel '$UI_TUNNEL_NAME'."
echo "   You can find this by running: cloudflared tunnel info $UI_TUNNEL_NAME"
echo "2. Access the UI at the configured hostname."
echo ""
echo "To access the Firebase Functions tunnel:"
echo "1. Configure your application to use the hostname provided by Cloudflare for tunnel '$FUNCTIONS_TUNNEL_NAME'."
echo "   You can find this by running: cloudflared tunnel info $FUNCTIONS_TUNNEL_NAME"
echo "2. Make requests to your functions using the configured hostname."
echo ""
echo "To stop the tunnels, press Ctrl+C in this terminal."

# Wait for background processes to finish
wait $UI_TUNNEL_PID
wait $FUNCTIONS_TUNNEL_PID

echo "Tunnels stopped."