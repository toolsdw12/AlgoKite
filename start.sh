#!/bin/bash

# Kite Token Manager - Quick Start Script

echo "🪁 Kite Token Manager - Starting Services"
echo "========================================"
echo ""

# Check if .env exists in root
if [ ! -f .env ]; then
    echo "⚠️  No .env file found in root directory"
    echo ""
    echo "Creating .env file..."

    # Generate encryption key
    cd backend
    ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    cd ..

    echo "ENCRYPTION_KEY=$ENCRYPTION_KEY" > .env
    echo "✅ Created .env with encryption key"
    echo ""
fi

# Check if backend .env exists
if [ ! -f backend/.env ]; then
    echo "⚠️  No backend/.env file found"
    echo ""
    echo "Creating backend/.env..."
    cp backend/.env.example backend/.env

    # Read encryption key from root .env
    ENCRYPTION_KEY=$(grep ENCRYPTION_KEY .env | cut -d '=' -f2)

    # Update backend .env
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/your_32_byte_hex_key_here/$ENCRYPTION_KEY/" backend/.env
    else
        sed -i "s/your_32_byte_hex_key_here/$ENCRYPTION_KEY/" backend/.env
    fi

    echo "✅ Created backend/.env"
    echo ""
fi

# Check if Docker is available
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "🐳 Docker detected - Starting with Docker Compose"
    echo ""
    docker-compose up -d
    echo ""
    echo "✅ Services started!"
    echo ""
    echo "📊 Dashboard: http://localhost:5173"
    echo "🔧 Backend API: http://localhost:3000"
    echo "🗄️  MongoDB: localhost:27017"
    echo ""
    echo "View logs: docker-compose logs -f"
    echo "Stop services: docker-compose down"
else
    echo "⚠️  Docker not found - Starting manually"
    echo ""

    # Check if MongoDB is running
    if ! pgrep -x "mongod" > /dev/null; then
        echo "❌ MongoDB is not running!"
        echo "Please start MongoDB first:"
        echo "  - macOS: brew services start mongodb-community"
        echo "  - Linux: sudo systemctl start mongod"
        echo "  - Windows: Start MongoDB service"
        exit 1
    fi

    echo "✅ MongoDB is running"
    echo ""

    # Install dependencies if needed
    if [ ! -d "backend/node_modules" ]; then
        echo "📦 Installing backend dependencies..."
        cd backend && npm install && cd ..
    fi

    if [ ! -d "froentend/node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        cd froentend && npm install && cd ..
    fi

    echo ""
    echo "🚀 Starting services..."
    echo ""

    # Start backend in background
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..

    # Wait a bit for backend to start
    sleep 3

    # Start frontend
    cd froentend
    npm run dev

    # Cleanup on exit
    trap "kill $BACKEND_PID" EXIT
fi
