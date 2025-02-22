#!/bin/bash

# Function to check if MongoDB is running
check_mongodb() {
  if command -v mongosh > /dev/null; then
    if mongosh --eval "db.serverStatus()" > /dev/null 2>&1; then
      return 0
    fi
  fi
  return 1
}

# Cleanup MongoDB socket and lock files
cleanup_mongodb() {
  echo "Cleaning up MongoDB files..."
  sudo rm -f /tmp/mongodb-27017.sock
  rm -f ./data/db/mongod.lock
  rm -f ./data/db/WiredTiger.lock
}

# Kill any existing processes on port 5000
echo "Checking for processes on port 5000..."
if command -v lsof > /dev/null; then
  # macOS/Linux
  pid=$(lsof -ti:5000)
  if [ ! -z "$pid" ]; then
    echo "Killing process on port 5000..."
    kill -9 $pid
  fi
else
  # Windows (when running in Git Bash or similar)
  netstat -ano | findstr :5000 | awk '{print $5}' | xargs -r taskkill /F /PID
fi

# Check if MongoDB is already running
echo "Checking MongoDB status..."
if check_mongodb; then
  echo "MongoDB is already running"
else
  echo "Starting MongoDB..."
  if command -v mongod > /dev/null; then
    # Clean up any existing MongoDB files
    cleanup_mongodb

    # Create data directory if it doesn't exist
    mkdir -p ./data/db
    
    # Set proper permissions
    chmod 777 ./data/db
    
    # Start MongoDB with specific configuration
    mongod --dbpath ./data/db --bind_ip 127.0.0.1 &
    
    # Wait for MongoDB to start
    echo "Waiting for MongoDB to start..."
    for i in {1..30}; do
      if check_mongodb; then
        echo "MongoDB started successfully"
        break
      fi
      sleep 1
      if [ $i -eq 30 ]; then
        echo "Failed to start MongoDB"
        exit 1
      fi
      echo -n "."
    done
  else
    echo "MongoDB not found. Please install MongoDB first."
    exit 1
  fi
fi

# Start the Node.js server
echo "Starting Node.js server..."
npm run dev 