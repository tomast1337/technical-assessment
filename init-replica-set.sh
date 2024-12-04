#!/bin/bash

# Debugging script for MongoDB replica set initialization

# Variables (adjust these to match your exact configuration)
USERNAME="adminUser"
PASSWORD="strongPassword"
AUTH_DB="admin"

# Wait for MongoDB instances to be ready
echo "Waiting for MongoDB instances to start..."
for i in {3..1}; do
    echo "Waiting $i seconds..."
    sleep 1
done

# First, verify container connectivity
echo "Checking container connectivity..."
docker ps

# Check if MongoDB instances are running
for container in mongo1 mongo2 mongo3; do
    echo "Checking if $container is running..."
    if ! docker exec $container mongosh --eval 'db.runCommand({ ping: 1 })'; then
        echo "$container is not running or not reachable"
        exit 1
    fi
done

# Attempt to connect and show user info to verify credentials
echo "Verifying credentials..."
docker exec mongo1 mongosh -u "$USERNAME" -p "$PASSWORD" --authenticationDatabase "$AUTH_DB" --eval 'db.runCommand({connectionStatus : 1})' | grep "Authenticated"
if [ $? -ne 0 ]; then
    echo "Failed to authenticate with MongoDB"
    exit 1
fi

# Initialize the replica set
echo "Initializing replica set..."
docker exec mongo1 mongosh -u "$USERNAME" -p "$PASSWORD" --authenticationDatabase "$AUTH_DB" --eval '
try {
  rs.initiate({
    _id: "rs0",
    members: [
      { _id: 0, host: "mongo1:27017" },
      { _id: 1, host: "mongo2:27017" },
      { _id: 2, host: "mongo3:27017" }
    ]
  });
  print("Replica set initialization started");
} catch(error) {
  print("Error initializing replica set: " + error);
}
'

# Check the status of the replica set
echo "Checking replica set status..."
docker exec mongo1 mongosh -u "$USERNAME" -p "$PASSWORD" --authenticationDatabase "$AUTH_DB" --eval 'rs.status()'